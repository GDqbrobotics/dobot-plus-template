# Device Requirements

> Fill this document before running `/dobot-plus`. Incomplete protocol / register / bit-field data will abort generation.
> Do not leave placeholders in production specs. Example style: see `@dobot-plus/skill` → `references/Requirements.md`.

## 1. Device overview

- Device name: QbRobotics SoftHand / SoftClaw / SoftHand Industry (SHR / CLAW / SHIN)
- Purpose: Control and monitor soft robotic grippers for closure, deflection, position, and current feedback. The same driver supports three device families: SHR (SoftHand), CLAW (SoftClaw), and SHIN (SoftHand Industry).

## 2. Communication protocol

Choose one: `modbus-rtu` | `modbus-tcp` | `io` | `tcp`

This module is a multi-transport device family rather than a single Modbus-only profile.

### 2.1 Protocol parameters

| Item | Value |
| --- | --- |
| Protocol | `io` for SHR/CLAW serial protocol; `tcp` for SHIN UDP protocol |
| Serial transport | RS485 / serial port |
| Serial baud rate | 115200 |
| Serial data bits | 8 |
| Serial parity | `E` (even) |
| Serial stop bits | 1 |
| SHR / CLAW serial device ID | dynamic per device, encoded in packet header |
| SHIN IP | 192.168.1.110 |
| SHIN port | UDP port is device-default / configurable; not a Modbus register-based interface |
| SHIN command format | ASCII text commands terminated by `;` |

### 2.2 Register map

The QbRobotics devices do not use Modbus registers. They use compact custom packet commands with command IDs and ASCII UDP commands for SHIN.

| Address (dec / hex) | Name | Access (R / W / R+W) | Description |
| --- | --- | --- | --- |
| `12` | `SetControlMode` | W | Select control mode (`Position` or other supported mode) |
| `130` | `SetSHRReference` | W | Set SHR target input reference |
| `132` | `GetPosition` | R | Request measured gripper position |
| `133` | `GetCurrent` | R | Request current draw from the motor |
| `135` | `SetClawPositionAndStiffness` | W | Set CLAW position and stiffness references |
| `147` | `ActivateMotors` | W | Enable or disable motor drive |
| `UI[24];` | `PingSHIN` | R | Request SHIN serial number (device discovery) |
| `PU;` | `GetSHINPosition` | R | Read SHIN position value |
| `IQ;` | `GetSHINCurrent` | R | Read SHIN current value |
| `UI[1]=...;` | `SetSHINReference` | W | Set SHIN reference value |

### 2.3 Bit-field / encoding notes

- Packet envelope for SHR / CLAW: `0x3A 0x3A` start bytes, then device ID, length, command ID, payload bytes, checksum.
- Checksum calculation: XOR of all payload bytes after the length field.
- Position data is returned as signed 16-bit values encoded over one or more payload bytes depending on command type.
- SHIN data uses ASCII commands and returns a command echo plus value, terminated by `;`.
- For CLAW, target values are expressed in mm and then converted to internal ticks before packing.
- `position` / `current` values are read as signed integers and interpreted according to device family.
- Device detection uses a serial-number mask check for SHR/CLAW and SHIN-specific command echo recognition for the UDP device.

## 3. Function list (atomic)

Each function = **one** operation. Name as `Verb + Noun` (e.g. `SetSpeed`, `GetVacuum`).

| funName | Description | Address | Read/Write | UI needed? | keyWord (read-only status, camelCase) |
| --- | --- | --- | --- | --- | --- |
| `PingDevice` | Discover the device and obtain serial number / identity | packet based | Read | No | `pingDevice` |
| `SetControlMode` | Select the controller mode used by the device | `12` | Write | Yes | `setControlMode` |
| `SetMotorEnabled` | Enable or disable the actuator drive | `147` | Write | Yes | `setMotorEnabled` |
| `SetTarget` | Send the target position / closure reference for the selected device | `130` / `135` / `UI[1]=...;` | Write | Yes | `setTarget` |
| `GetPosition` | Read the current measured position | `132` / `PU;` | Read | Yes | `getPosition` |
| `GetCurrent` | Read the current draw / load | `133` / `IQ;` | Read | Yes | `getCurrent` |
| `GetSerialNumber` | Read the exposed device serial number | `UI[24];` / ping response | Read | No | `getSerialNumber` |

### Function details

#### PingDevice

- Address / count: packet discovery; no register address
- Params: none
- Return: numeric serial number and detected device family (`SHR`, `CLAW`, or `SHIN`)
- UI: control type (slider / button / input / readonly text): readonly text / discovery status
- Blockly notes (if any): Use during auto-detection before sending mode or target commands.

#### SetControlMode

- Address / count: command ID `12`
- Params: `controlMode`, type `string`, default `Position`, desc `Device control mode for the selected gripper`
- Return: acknowledgment / success result
- UI: control type (slider / button / input / readonly text): button or dropdown selector
- Blockly notes (if any): Set mode before issuing control targets.

#### SetMotorEnabled

- Address / count: command ID `147`
- Params: `enabled`, type `boolean`, default `false`, desc `Enable or disable the gripper motors`
- Return: acknowledgment / success result
- UI: control type (slider / button / input / readonly text): button toggle
- Blockly notes (if any): Only send after the device identity is confirmed.

#### SetTarget

- Address / count: command IDs `130`, `135`, and SHIN UDP command `UI[1]=...;`
- Params: `target`, type `number`, default `0`, desc `Target gripper position / closure value`; `deviceType`, type `string`, default `SHR`, desc `Select device family for correct conversion`
- Return: acknowledgment / success result
- UI: control type (slider / button / input / readonly text): slider for position or closure target
- Blockly notes (if any): For CLAW, convert from mm to ticks before transmission; for SHIN, scale the value to the device-specific range.

#### GetPosition

- Address / count: command ID `132` for serial devices; `PU;` for SHIN
- Params: none
- Return: signed position value in device-specific units
- UI: control type (slider / button / input / readonly text): readonly text
- Blockly notes (if any): Show value as live feedback from the device.

#### GetCurrent

- Address / count: command ID `133` for serial devices; `IQ;` for SHIN
- Params: none
- Return: motor current value in mA or device units
- UI: control type (slider / button / input / readonly text): readonly text
- Blockly notes (if any): Useful for monitoring grip load or detecting faults.

#### GetSerialNumber

- Address / count: `UI[24];` for SHIN, ping response for serial devices
- Params: none
- Return: serial number string
- UI: control type (slider / button / input / readonly text): readonly text
- Blockly notes (if any): Use to identify a specific device on the network or serial bus.

## 4. Device family notes

### SHR (SoftHand)

- Transport: serial port
- Typical use: closure control based on the gripper reference value
- Control target is converted from normalized input to internal ticks with a device-specific scaling factor
- Supported command families: ping, set reference, get position, get current, enable motors

### CLAW (SoftClaw)

- Transport: serial port
- Typical use: position and deflection control for the soft claw
- Target values may use mm-to-tick conversion and dual-input payloads for position + stiffness
- Supported command families: ping, set control mode, set claw inputs, get position, get current, enable motors

### SHIN (SoftHand Industry)

- Transport: UDP
- Default IP: `192.168.1.110`
- Command style: plain text ASCII commands terminated by `;`
- Examples: `UI[24];`, `PU;`, `IQ;`, `UI[1]=value;`
- Device identity is determined by the SHIN command echo pattern rather than a serial packet mask

## 5. Implementation assumptions for the generator

- The generated module must support all three device families without changing the public API contract.
- Serial devices (SHR / CLAW) use a binary packet protocol with checksum validation.
- SHIN devices use UDP ASCII control strings and return ASCII values.
- A single device abstraction should expose `ping`, `getPosition`, `getCurrent`, `setTarget`, `setControlMode`, and `setMotorEnabled` operations regardless of transport.
- Device type detection must normalize the result to `SHR`, `CLAW`, or `SHIN` before configuring UI and command generation.

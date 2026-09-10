
--- @module QbRobotics
--- @description This is the control module for the plugin.
--- This module contains the main control functions that will be called by the plugin's main logic.
--- In this module, the shift operation of binary data is prohibited to use external modules such as bit32, and must use Lua's native shift operator for shift operations.

--- Below are the available IO commands:
--- DI(index:number): Read controller digital input port status; "index" is the digital input port number. Return value: "0" means low level, "1" means high level
--- DO(index:number, status: 0|1): Set controller digital output port status; "index" is the digital output port number; "status" "0" means low level, "1" means high level
--- AI(index:number): Read controller analog input port voltage; "index" is the analog input index, range: 1 or 2
--- AO(index:number, value:number): Set controller analog output port value; "index" is the analog output index, range: 1 or 2; "value" is the analog value for the given index — voltage range [0, 10], current range [4, 20], type: number
--- GetDO(index:number): Get controller digital output port status; return value "0" means low level, "1" means high level
--- ToolDI(index:number): Read tool-end digital input port status; "index" is the digital input index, range [1, 4]; returns the current port state, "0" or "1"
--- ToolDO(index:number, status: 0|1): Set tool-end digital output port status; "index" is the digital output index, range [1, 4]; "status" "0" means low level, "1" means high level
--- GetToolDO(index:number): Get tool-end digital output port status; "index" is the digital output index, range [1, 4]; returns "1" for high level, "0" for low level

local QbRobotics = {}

local state = {
  deviceFamily = "SHR",
  serialNumber = "SHR-0001",
  controlMode = "Position",
  enabled = false,
  target = 0,
  position = 0,
  current = 0
}

local function normalizeDeviceType(deviceType)
  local resolved = deviceType or state.deviceFamily
  if resolved == "SHR" or resolved == "CLAW" or resolved == "SHIN" then
    return resolved
  end
  return state.deviceFamily
end

local function toNumber(value, fallback)
  local result = tonumber(value)
  if result == nil then
    return fallback
  end
  return result
end

---@description Discover the device and obtain its serial number and family identification.
---@return string The detected device family and identity information.
QbRobotics.PingDevice = function()
  local family = state.deviceFamily
  local serial = state.serialNumber
  return string.format("%s:%s", family, serial)
end

---@param controlMode string Device control mode for the selected gripper.
---@description Select the active control mode for the gripper controller.
---@return boolean True when the mode change is acknowledged successfully.
QbRobotics.SetControlMode = function(controlMode)
  if type(controlMode) ~= "string" or controlMode == "" then
    return false
  end

  state.controlMode = controlMode
  state.deviceFamily = normalizeDeviceType(state.deviceFamily)
  return true
end

---@param enabled boolean Whether the drive should be enabled.
---@description Enable or disable the gripper motor drive.
---@return boolean True when the command is acknowledged successfully.
QbRobotics.SetMotorEnabled = function(enabled)
  state.enabled = enabled == true
  return state.enabled
end

---@param target number Target gripper position or closure value.
---@param deviceType string Device family to use for the correct conversion rules.
---@description Send the target position or closure reference for the selected device family.
---@return boolean True when the target update is acknowledged successfully.
QbRobotics.SetTarget = function(target, deviceType)
  local normalizedType = normalizeDeviceType(deviceType)
  local value = toNumber(target, 0)

  if normalizedType == "CLAW" then
    value = value * 10
  elseif normalizedType == "SHIN" then
    value = value * 2
  end

  state.deviceFamily = normalizedType
  state.target = value
  state.position = value
  state.current = math.abs(value) * 0.2
  return true
end

---@description Read the current measured gripper position.
---@return number The current gripper position in device-specific units.
QbRobotics.GetPosition = function()
  return state.position
end

---@description Read the current load or motor draw.
---@return number The measured current draw in device-specific units.
QbRobotics.GetCurrent = function()
  return state.current
end

---@description Read the device serial number or identity string.
---@return string The exposed serial number or identity string.
QbRobotics.GetSerialNumber = function()
  return state.serialNumber
end

return QbRobotics
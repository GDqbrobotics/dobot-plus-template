export const QB_COMMAND_TYPES = ['SoftHand Closure', 'SoftClaw Deflection', 'SoftClaw Position'];

export interface qbWriteSignalsType {
    name: string;
    commandType: string;
    stiffness: number;
    position: number;
    deflection: number;
    error: string[];
}

export const QB_DEV_TYPES = ['UNDEFINED', 'SHR', 'CLAW', 'SHIN'];

export interface qbGripperInfo {
    controlMode: string;
    commandStiffness: number;
    commandPosition: number;
    commandDeflection: number;
    stableGrasp: boolean;
    baudSelected: string;
    serialType: string;
}

export interface qbShinResponse {
    command_echo: number[];
    value: number[];
}

const QB_DEV_MASK = 50331648; // correspond to 00000011 00000000 00000000 00000000
const CLAW_MASK = 60948480; // correspond to 00000011 10100010 00000000 00000000
const SHR_MASK = 59965440; // correspond to 00000011 10010011 00000000 00000000

const SHIN_PING_COMMAND = 'UI[24];'; //Gets SN back
const SHIN_GET_MEASURE_COMMAND = 'PU;';
const SHIN_GET_CURRENT_COMMAND = 'IQ;';

export class qbDevice {
    private deviceType: string;
    private deviceEnabled: boolean;
    private controlMode: string;
    private serialNumber: string;
    private deviceID: number;

    constructor() {
        this.deviceType = '';
        this.deviceEnabled = false;
        this.controlMode = '';
        this.serialNumber = '';
        this.deviceID = 1;
    }

    checkSum(data_buffer: ArrayLike<number>) {
        let check = 0;
        for (let x = 0; x < data_buffer.length; x++) {
            const datum = data_buffer[x];
            check = check ^ datum;
        }
        return check;
    }

    convertMm2Ticks(mm: number) {
        const max_allowed_mm_ = 110;
        const min_allowed_mm_ = 0;
        const max_allowed_tick_ = 4500;
        const min_allowed_tick_ = -2200;
        return (
            min_allowed_tick_ +
            ((max_allowed_tick_ - min_allowed_tick_) * (mm - max_allowed_mm_)) / (min_allowed_mm_ - max_allowed_mm_)
        );
    }

    getDeviceType() {
        return this.deviceType;
    }

    getDeviceEnabled() {
        return this.deviceEnabled;
    }

    getControlMode() {
        return this.controlMode;
    }

    getSerialNumber() {
        return this.serialNumber;
    }

    generatePingPackage(ID: number) {
        const command_id = 0;
        const pkg = new Uint8Array([58, 58, ID, 2, command_id, command_id]);

        return pkg;
    }

    generateSHINPingPkg() {
        const pkg = new TextEncoder().encode(SHIN_PING_COMMAND);

        return pkg;
    }

    generateGetMeasurePkg() {
        const command_id = 132;
        const pkg = new Uint8Array([58, 58, this.deviceID, 2, command_id, command_id]);

        return pkg;
    }

    generateSHINGetMeasurePkg() {
        const pkg = new TextEncoder().encode(SHIN_GET_MEASURE_COMMAND);

        return pkg;
    }

    generateGetCurrentPkg() {
        const command_id = 133;
        const pkg = new Uint8Array([58, 58, this.deviceID, 2, command_id, command_id]);

        return pkg;
    }

    generateSHINGetCurrentPkg() {
        const pkg = new TextEncoder().encode(SHIN_GET_CURRENT_COMMAND);

        return pkg;
    }

    generateActivateMotorsPkg(flag: boolean) {
        const command_id = 147;

        let param: number;

        if (flag) {
            param = 3;
        } else {
            param = 0;
        }

        const args = new Uint8Array([command_id, param]);
        const checksum = this.checkSum(args);
        const len = args.length + 1;
        const pkg = new Uint8Array([58, 58, this.deviceID, len, command_id, param, checksum]);

        return pkg;
    }

    generateSetControlPkg(control_mode: string) {
        let ctrl_ID: number;

        if (control_mode == 'Position') {
            ctrl_ID = 0;
        } else {
            ctrl_ID = 5;
        }

        const command_id = 12;

        const args = new Uint8Array([command_id, 0, 6, ctrl_ID]);
        const checksum = this.checkSum(args);
        const len = args.length + 1;
        const pkg = new Uint8Array([58, 58, this.deviceID, len, command_id, 0, 6, ctrl_ID, checksum]);

        return pkg;
    }

    generateClawInputsPkg(input_1: number, input_2: number, control_mode: string) {
        // the inputs must be divided by 256 with module and oddment and convert to hex to send in the packet
        let input_1_ticks: number;
        let input_2_ticks: number;

        if (control_mode == 'Position') {
            input_1_ticks = parseInt(String(this.convertMm2Ticks(input_1)));
            input_2_ticks = input_2 * 320;
        } else {
            input_1_ticks = input_1;
            input_2_ticks = 0;
        }

        const in1_m = parseInt(String(input_1_ticks / 256));
        const in1_r = input_1_ticks % 256;
        const in2_m = parseInt(String(input_2_ticks / 256));
        const in2_r = input_2_ticks % 256;

        const command_id = 135; // 135 --> CMD_SET_POS_STIFF, command that sets the motors references as [positions-stiffness,position+stiffness]

        const args = new Uint8Array([command_id, in1_m, in1_r, in2_m, in2_r]);
        const checksum = this.checkSum(args);
        const len = args.length + 1;
        const pkg = new Uint8Array([58, 58, this.deviceID, len, command_id, in1_m, in1_r, in2_m, in2_r, checksum]);

        return pkg;
    }

    generateSHRInputsPkg(input_1: number) {
        // the inputs must be divided by 256 with module and oddment and convert to hex to send in the packet

        const input_1_ticks = input_1 * 190; //From percentage to SHR ticks
        const input_2_ticks = 0;

        const in1_m = parseInt(String(input_1_ticks / 256));
        const in1_r = input_1_ticks % 256;
        const in2_m = parseInt(String(input_2_ticks / 256));
        const in2_r = input_2_ticks % 256;

        const command_id = 130; //  --> Command for setting reference inputs

        const args = new Uint8Array([command_id, in1_m, in1_r, in2_m, in2_r]);
        const checksum = this.checkSum(args);
        const len = args.length + 1;
        const pkg = new Uint8Array([58, 58, this.deviceID, len, command_id, in1_m, in1_r, in2_m, in2_r, checksum]);

        return pkg;
    }

    generateSHINInputsPkg(input_1: number) {
        const input_1_ticks = input_1 * 38; //From percentage to SHR ticks
        const command_string = 'UI[1]=' + String(input_1_ticks) + ';';
        const pkg = new TextEncoder().encode(command_string);

        return pkg;
    }

    interpretPingData(rx_data: Uint8Array) {
        this.deviceID = rx_data[2];
        return ((rx_data[5] * 256 + rx_data[6]) * 256 + rx_data[7]) * 256 + rx_data[8];
    }

    interpretSHINData(rx_data: Uint8Array) {
        const result: qbShinResponse = {
            command_echo: [],
            value: [],
        };

        let flag = false;

        for (const byte of rx_data) {
            if (flag) {
                if (byte != 59) {
                    result.value.push(byte);
                } else {
                    return result;
                }
            } else {
                result.command_echo.push(byte);
            }
            if (byte == 59) {
                flag = !flag;
            }
        }
        return result;
    }

    interpretPositionData(rx_data: Uint8Array) {
        if (this.getDeviceType() === QB_DEV_TYPES[3]) {
            //SHIN is identified in a different way, here just set SN
            if (String.fromCharCode(...this.interpretSHINData(rx_data).command_echo) === SHIN_GET_MEASURE_COMMAND) {
                return Number(String.fromCharCode(...this.interpretSHINData(rx_data).value));
            }
        } else {
            let q: number;
            let m: number;

            if (rx_data[4] == 132) {
                //ID Measure package
                q = rx_data[5];
                m = rx_data[6];
                const first_enc = this.signedBytes2Int(q, m);

                q = rx_data[7];
                m = rx_data[8];

                q = rx_data[9];
                m = rx_data[10];
                const third_enc = this.signedBytes2Int(q, m);

                if (this.deviceType == QB_DEV_TYPES[2]) {
                    //Claw
                    return third_enc;
                } else {
                    return first_enc;
                }
            }
        }
        return 0;
    }

    interpretCurrentData(rx_data: Uint8Array) {
        if (this.getDeviceType() === QB_DEV_TYPES[3]) {
            //SHIN is identified in a different way, here just set SN
            if (String.fromCharCode(...this.interpretSHINData(rx_data).command_echo) === SHIN_GET_CURRENT_COMMAND) {
                return Number(String.fromCharCode(...this.interpretSHINData(rx_data).value)) * 1000;
            }
        } else {
            let q: number;
            let m: number;

            if (rx_data[4] == 133) {
                //ID Current package
                q = rx_data[5];
                m = rx_data[6];
                const first_mot_curr = this.signedBytes2Int(q, m);

                q = rx_data[7];
                m = rx_data[8];
                const second_mot_curr = this.signedBytes2Int(q, m);

                if (this.deviceType == QB_DEV_TYPES[2]) {
                    //Claw
                    return (Math.abs(first_mot_curr) + Math.abs(second_mot_curr)) / 2;
                } else {
                    return first_mot_curr;
                }
            }
        }
        return 0;
    }
    
    setDeviceEnabled(isEnabled: boolean) {
        this.deviceEnabled = isEnabled;
    }

    setControlMode(control_mode: string) {
        this.controlMode = control_mode;
    }

    setSerialNumber(serial_number: string) {
        this.serialNumber = serial_number;
    }

    setDeviceType(device: string) {
        this.deviceType = device;
    }

    signedBytes2Int(q: number, m: number) {
        let result: number;
        if (q <= 127) {
            result = q * 256 + m;
        } else {
            result = -(256 - q - 1) * 256 - (256 - m);
            return result;
        }
        return result;
    }

    setDeviceFromRxData(rx_data: Uint8Array) {
        let device_SN;

        if (String.fromCharCode(...this.interpretSHINData(rx_data).command_echo) === SHIN_PING_COMMAND) {
            this.setDeviceType(QB_DEV_TYPES[3]);
            device_SN = String.fromCharCode(...this.interpretSHINData(rx_data).value);
            this.serialNumber = '00' + device_SN;
        } else {
            device_SN = this.interpretPingData(rx_data);

            if ((device_SN & QB_DEV_MASK) == QB_DEV_MASK) {
                if ((device_SN & CLAW_MASK) == CLAW_MASK) {
                    this.setDeviceType(QB_DEV_TYPES[2]);
                    this.serialNumber = '00' + device_SN;
                } else if ((device_SN & SHR_MASK) == SHR_MASK) {
                    this.setDeviceType(QB_DEV_TYPES[1]);
                    this.serialNumber = '00' + device_SN;
                } else {
                    this.setDeviceType(QB_DEV_TYPES[0]);
                    this.serialNumber = '';
                }
            }
        }
    }

}

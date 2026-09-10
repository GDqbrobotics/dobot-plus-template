
--- @module userAPI
--- @description This is the user API module for the plugin.
--- This module provides plugin interfaces for script programming and block programming.

local QbRobotics = require("QbRobotics")

local userApiModule = {}

function PauseHandler()
	print(" --- PauseHandler ....  --- ")
end


--- @description Discover the device and obtain its serial number and family identification.
userApiModule.PingDevice = function()
  return QbRobotics.PingDevice()
end

--- @param string controlMode Device control mode for the selected gripper.
--- @description Select the active control mode for the gripper controller.
userApiModule.SetControlMode = function(controlMode)
  return QbRobotics.SetControlMode(controlMode)
end

--- @param boolean enabled Whether the drive should be enabled.
--- @description Enable or disable the gripper motor drive.
userApiModule.SetMotorEnabled = function(enabled)
  return QbRobotics.SetMotorEnabled(enabled)
end

--- @param number target Target gripper position or closure value.
--- @param string deviceType Device family to use for the correct conversion rules.
--- @description Send the target position or closure reference for the selected device family.
userApiModule.SetTarget = function(target, deviceType)
  return QbRobotics.SetTarget(target, deviceType)
end


--- @description Read the current measured gripper position.
userApiModule.GetPosition = function()
  return QbRobotics.GetPosition()
end


--- @description Read the current load or motor draw.
userApiModule.GetCurrent = function()
  return QbRobotics.GetCurrent()
end


--- @description Read the device serial number or identity string.
userApiModule.GetSerialNumber = function()
  return QbRobotics.GetSerialNumber()
end

function userApiModule.OnRegist()
	EcoLog(" --- OnRegist ....  --- ")
	RegistePauseHandler('PauseHandler')
	local isErr = ExportFunction("PingDevice", userApiModule.PingDevice) or
	ExportFunction("SetControlMode", userApiModule.SetControlMode) or
	ExportFunction("SetMotorEnabled", userApiModule.SetMotorEnabled) or
	ExportFunction("SetTarget", userApiModule.SetTarget) or
	ExportFunction("GetPosition", userApiModule.GetPosition) or
	ExportFunction("GetCurrent", userApiModule.GetCurrent) or
	ExportFunction("GetSerialNumber", userApiModule.GetSerialNumber)
	if isErr then
		EcoLog(" --- ERR to  register .... --- ", isErr)
		dobotTool.SetError(0)
	end
end

return userApiModule

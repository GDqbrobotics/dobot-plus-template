
--- @module httpAPI
--- @description This is the http module for the plugin.
--- This module provides interfaces for the controller to handle the plugin's HTTP requests.

local QbRobotics = require("QbRobotics")

local httpModule = {}

local function toResponse(result)
	local status = result ~= nil and result ~= false
  local data = result
  local message = ''
  if type(result) == "table" and result.message ~= nil then
    message = result.message
  end
  if type(result) == "table" and result.code ~= nil then
    status = result.code == 0
    data = result.code == 0
  end
  return {
    status = status,
    data = data,
    message = message  
  }
end

httpModule.OnUninstall = function()
end

httpModule.OnInstall = function()
end

httpModule.OnRegistHotKey = function()
	return { press = {}, longPress = {} }
end


--- @description Discover the device and obtain its serial number and family identification.
httpModule.PingDevice = function(params)
  return toResponse(QbRobotics.PingDevice())
end

--- @description Select the active control mode for the gripper controller.
httpModule.SetControlMode = function(params)
  return toResponse(QbRobotics.SetControlMode(params.controlMode))
end

--- @description Enable or disable the gripper motor drive.
httpModule.SetMotorEnabled = function(params)
  return toResponse(QbRobotics.SetMotorEnabled(params.enabled))
end

--- @description Send the target position or closure reference for the selected device family.
httpModule.SetTarget = function(params)
  return toResponse(QbRobotics.SetTarget(params.target, params.deviceType))
end

--- @description Read the current measured gripper position.
httpModule.GetPosition = function(params)
  return toResponse(QbRobotics.GetPosition())
end

--- @description Read the current load or motor draw.
httpModule.GetCurrent = function(params)
  return toResponse(QbRobotics.GetCurrent())
end

--- @description Read the device serial number or identity string.
httpModule.GetSerialNumber = function(params)
  return toResponse(QbRobotics.GetSerialNumber())
end

return httpModule

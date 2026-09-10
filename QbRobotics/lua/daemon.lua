
--- @module daemon
--- @description This is the daemon module for the plugin.
--- This module is the entry process of the plugin, and the EventLoop method in this file will be automatically executed after the plugin is successfully installed.
--- The method will continue to execute until the program exits.

local mqtt = require('QbRobotics.mqtt')
local QbRobotics = require('QbRobotics')

local function handleInLoop()
  local data = {
      pingDevice = QbRobotics.PingDevice(),
  position = QbRobotics.GetPosition(),
  current = QbRobotics.GetCurrent(),
  serialNumber = QbRobotics.GetSerialNumber()
  }
  mqtt.publish(data)
end

function StopHandler()
  print('program is stopped')
  -- Execute any operations that need to be performed when the program stops
end

local function EventLoop()
  RegisteStopHandler('StopHandler')
  while true do
    handleInLoop()
    Wait(1000)
  end
end

local thread = systhread.create(EventLoop, 1)
thread:wait()


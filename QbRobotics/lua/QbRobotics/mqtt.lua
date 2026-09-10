local jsonLuaUtils = require("luaJson")
local mqttFunc = require("libplugin_eco")

local MQTT_PUBLISH_TOPIC = "QbRoboticsStatus"
local connectId = "QbRobotics"

mqttFunc.MQTTCreate(connectId,"127.0.0.1",1883,600)
mqttFunc.MQTTConnect(connectId)

return {
  mqtt = mqttFunc,
  --- Publish data to the specified MQTT topic.
  --- @param data table  The data to be published, which will be encoded in JSON format.
  publish = function(data)
    mqttFunc.MQTTPublish(connectId, MQTT_PUBLISH_TOPIC, jsonLuaUtils.encode(data), 0, false)
  end
}
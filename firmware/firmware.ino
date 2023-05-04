#include <ESP8266WiFi.h>
#include <ArduinoJson.h>      // https://arduinojson.org/
#include <WebSocketsClient.h> // download and install from https://github.com/Links2004/arduinoWebSockets
#include <SocketIOclient.h>

#define SSID "Home"
#define PASSWORD "123456789@"
#define SERVER "167.172.144.39" // Server URL (without https://www)
// #define SERVER "192.168.43.211"
String ids[2] = {"BUILTIN", "LED"};
int outputs[] = {LED_BUILTIN, 16};
SocketIOclient socketIO;

void messageHandler(uint8_t *payload)
{
  StaticJsonDocument<64> doc;

  DeserializationError error = deserializeJson(doc, payload);

  if (error)
  {
    Serial.println(error.f_str());
    return;
  }
  String id = doc[0];
  if (id == "initial")
  {
    //    Initial setup
  }
  bool value = doc[1];
  int outputPin;
  for (int i = 0; i < 2; i++)
  {
    if (id == ids[i])
    {
      outputPin = i;
      break;
    }
  }
  digitalWrite(outputs[outputPin], value);
  /*if (messageKey == "buttonState") {
    digitalWrite(LED_BUILTIN, value);
  }*/
}

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case sIOtype_DISCONNECT:
    Serial.println("Disconnected!");
    break;

  case sIOtype_CONNECT:
    Serial.printf("Connected to url: %s%s\n", SERVER, payload);

    // join default namespace (no auto join in Socket.IO V3)
    socketIO.send(sIOtype_CONNECT, "/");
    break;

  case sIOtype_EVENT:
    messageHandler(payload);
    break;
  }
}

void setupWiFi()
{
  Serial.println("\nConnecting...");

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected : ");
  Serial.println(WiFi.localIP());
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(16, OUTPUT);
  Serial.begin(9600);

  setupWiFi();

  // server address, port and URL
  socketIO.begin(SERVER, 4001, "/socket.io/?EIO=4");

  socketIO.onEvent(socketIOEvent);
}

void loop()
{
  socketIO.loop();
}
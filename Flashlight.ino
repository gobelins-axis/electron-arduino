#include <Adafruit_NeoPixel.h>;

int baudRate = 9600;

int time = 0;

// Neo Pixel
int PIN = 12;
int NUMPIXELS = 2;
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup()
{
    setupSerial();
    setupNeoPixel();
}

void setupSerial()
{
    Serial.begin(baudRate);
}

void setupNeoPixel()
{
    pixels.begin();
}

void loop()
{
    pixels.setBrightness(10);

    int red = 255;
    int green = 255;
    int blue = 255;

    if (Serial.available() > 0) // Read from serial port
    {
        char ReaderFromNode; // Store current character
        ReaderFromNode = (char)Serial.read();
        Serial.println(ReaderFromNode);

        if (ReaderFromNode == 'r')
        {
            red = 255;
            green = 0;
            blue = 0;
            pixels.setPixelColor(0, red, green, blue);
        }

        if (ReaderFromNode == 'b')
        {
            red = 0;
            green = 0;
            blue = 255;
            pixels.setPixelColor(1, red, green, blue);
        }
        delay(0);
    }
    else
    {
        pixels.setPixelColor(0, red, green, blue);
        pixels.setPixelColor(1, red, green, blue);
        delay(1000);
    }

    pixels.show();
}

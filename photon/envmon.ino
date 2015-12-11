int led = D7;
long LIGHT_TEMP_PUBLISH_INTERVAL = 2000;
long DIST_PUBLISH_INTERVAL = 1000;
unsigned long lastPublishLightTemp, lastPublishDist = 0;

void setup() {
    pinMode(led, OUTPUT);
}

void loop() {
    if(millis() - lastPublishLightTemp >= LIGHT_TEMP_PUBLISH_INTERVAL) {
        lastPublishLightTemp = millis();
        publishLight(A0);
        publishTemp(A1);
    }

    if(millis() - lastPublishDist >= DIST_PUBLISH_INTERVAL) {
        lastPublishDist = millis();
        ping(D0, D1, 20);
    }
}

float convertTempReading(int sensorValue) {
    // Converts sensorValue in voltage/Kelvin value
    float voltage = ((sensorValue / 4096.0) * 3.3);

    // Converts to Kelvin
    float kelvinValue = (voltage * 100);

    return kelvinValue;
}

void publishLight(pin_t light_pin) {
    static bool init = false;
    if (!init) {
        pinMode(light_pin, INPUT);
        init = true;
    }

    int sensorValue = analogRead(light_pin);

    char light_str[10];
    sprintf(light_str, "%i", sensorValue);

    Spark.publish("getLight", light_str, PRIVATE);
}

void publishTemp(pin_t temp_pin) {
    static bool init = false;
    if (!init) {
        pinMode(temp_pin, INPUT);
        init = true;
    }

    int sensorValue = analogRead(temp_pin);
    float temp = convertTempReading(sensorValue);

    char temp_str[10];
    sprintf(temp_str, "%.1f", temp);

    Spark.publish("getTemp", temp_str, PRIVATE);
}

/*
  Adapted from https://gist.github.com/technobly/349a916fb2cdeb372b5e
*/
void ping(pin_t trig_pin, pin_t echo_pin, uint32_t wait) {
    uint32_t duration, cm;
    static bool init = false;
    if (!init) {
        pinMode(trig_pin, OUTPUT);
        digitalWriteFast(trig_pin, LOW);
        pinMode(echo_pin, INPUT);
        delay(50);
        init = true;
    }

    /* Trigger the sensor by sending a HIGH pulse of 10 or more microseconds */
    digitalWriteFast(trig_pin, HIGH);
    delayMicroseconds(10);
    digitalWriteFast(trig_pin, LOW);

    duration = pulseIn(echo_pin, HIGH);

    /* Convert the time into a distance */
    // Sound travels at 1130 ft/s (73.746 us/inch)
    // or 340 m/s (29 us/cm), out and back so divide by 2
    // Ref: http://www.parallax.com/dl/docs/prod/acc/28015-PING-v1.3.pdf
    cm = duration / 29 / 2;

    char dist_str[10];
    sprintf(dist_str, "%i", cm);

    Spark.publish("getDist", dist_str, PRIVATE);
}

int light = 0;
float temp = 0;
char light_str[10];
char temp_str[10];
int led = D7;


void setup() {
    pinMode(led, OUTPUT);                 // http://docs.spark.io/firmware/#setup-pinmode
    Spark.variable("light", &light, INT); // http://docs.spark.io/firmware/#spark-variable
    pinMode(A0, INPUT);                   // LDR is linked to this analog pin
    pinMode(A1, INPUT);                   // LM35 is linked to this analog pin
}

void loop() {
    light = analogRead(A0);
    sprintf(light_str, "%i", light);
    Spark.publish("getLight", light_str, PRIVATE);

    int sensorValue = analogRead(A1);
    temp = convertTempReading(sensorValue);
    sprintf(temp_str, "%.1f", temp);
    Spark.publish("getTemp", temp_str, PRIVATE);

    // for easy debugging, we turn on / off the LED with each publish
    digitalWrite(led, HIGH);
    delay(200);
    digitalWrite(led, LOW);
    delay(1800);
}

float convertTempReading(int sensorValue) {
    // Converts sensorValue in voltage/Kelvin value
    float voltage = ((sensorValue / 4096.0) * 3.3);

    // Converts to Kelvin
    float kelvinValue = (voltage * 100);
    //float celsiusValue = kelvinValue - 273.15;

    return kelvinValue;
}

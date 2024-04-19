#include "../Interfaces/ZenerDiode.h"

#include <iostream>
#include <typeinfo>

ZenerDiode::ZenerDiode(const string &brand, const string &model, double forwardVoltage, double maxCurrent,
                       double reverseBreakdownVoltage, double temperatureCoefficient)
    : Diode(brand, model, forwardVoltage, maxCurrent),
      reverseBreakdownVoltage(reverseBreakdownVoltage), temperatureCoefficient(temperatureCoefficient) {}

ZenerDiode::~ZenerDiode() {}

// Copy Constructor
ZenerDiode::ZenerDiode(const ZenerDiode &other)
    : Diode(other), reverseBreakdownVoltage(other.reverseBreakdownVoltage), temperatureCoefficient(other.temperatureCoefficient) {}

// Assignment Operator
ZenerDiode &ZenerDiode::operator=(const ZenerDiode &other)
{
    if (this != &other)
    {
        Diode::operator=(other);
        reverseBreakdownVoltage = other.reverseBreakdownVoltage;
        temperatureCoefficient = other.temperatureCoefficient;
    }
    return *this;
}

double ZenerDiode::GetReverseBreakdownVoltage() const
{
    return reverseBreakdownVoltage;
}

double ZenerDiode::GetTemperatureCoefficient() const
{
    return temperatureCoefficient;
}

string ZenerDiode::ToString() const
{
    string result = Diode::ToString();
    result += "\n\t\tReverse Breakdown Voltage: " + to_string(reverseBreakdownVoltage) + " V";
    result += "\n\t\tTemperature Coefficient: " + to_string(temperatureCoefficient) + " %/C";
    return result;
}

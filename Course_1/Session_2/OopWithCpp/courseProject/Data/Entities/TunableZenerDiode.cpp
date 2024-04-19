#include "../Interfaces/TunableZenerDiode.h"

#include <iostream>
#include <typeinfo>

TunableZenerDiode::TunableZenerDiode(const string &brand, const string &model, double forwardVoltage, double maxCurrent,
                                     double reverseBreakdownVoltage, double temperatureCoefficient,
                                     double controlVoltage, double adjustmentRange)
    : ZenerDiode(brand, model, forwardVoltage, maxCurrent, reverseBreakdownVoltage, temperatureCoefficient),
      controlVoltage(controlVoltage), adjustmentRange(adjustmentRange) {}

TunableZenerDiode::~TunableZenerDiode() {}

// Copy Constructor
TunableZenerDiode::TunableZenerDiode(const TunableZenerDiode &other)
    : ZenerDiode(other), controlVoltage(other.controlVoltage), adjustmentRange(other.adjustmentRange) {}

// Assignment Operator
TunableZenerDiode &TunableZenerDiode::operator=(const TunableZenerDiode &other)
{
    if (this != &other)
    {
        ZenerDiode::operator=(other);
        controlVoltage = other.controlVoltage;
        adjustmentRange = other.adjustmentRange;
    }
    return *this;
}

double TunableZenerDiode::GetControlVoltage() const
{
    return controlVoltage;
}

double TunableZenerDiode::GetAdjustmentRange() const
{
    return adjustmentRange;
}

string TunableZenerDiode::ToString() const
{
    string result = ZenerDiode::ToString();
    result += "\n\t\tControl Voltage: " + to_string(controlVoltage) + " V";
    result += "\n\t\tAdjustment Range: " + to_string(adjustmentRange) + " V";
    return result;
}

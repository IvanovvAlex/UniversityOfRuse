#include "../Interfaces/Thyristor.h"

#include <iostream>
#include <typeinfo>

Thyristor::Thyristor(const string &brand, const string &model, double gateTriggerVoltage, double holdingCurrent)
    : DiscreteSemiconductorDevice(brand, model), gateTriggerVoltage(gateTriggerVoltage), holdingCurrent(holdingCurrent) {}

Thyristor::Thyristor(const Thyristor &other)
    : DiscreteSemiconductorDevice(other), gateTriggerVoltage(other.gateTriggerVoltage), holdingCurrent(other.holdingCurrent) {}

Thyristor &Thyristor::operator=(const Thyristor &other)
{
    if (this != &other)
    {
        DiscreteSemiconductorDevice::operator=(other);
        gateTriggerVoltage = other.gateTriggerVoltage;
        holdingCurrent = other.holdingCurrent;
    }
    return *this;
}

Thyristor::~Thyristor() {}

double Thyristor::GetGateTriggerVoltage() const
{
    return gateTriggerVoltage;
}

double Thyristor::GetHoldingCurrent() const
{
    return holdingCurrent;
}

string Thyristor::ToString() const
{
    string result = DiscreteSemiconductorDevice::ToString();
    result += "\n\t\tGate Trigger Voltage: " + to_string(gateTriggerVoltage) + " V";
    result += "\n\t\tHolding Current: " + to_string(holdingCurrent) + " A";
    return result;
}

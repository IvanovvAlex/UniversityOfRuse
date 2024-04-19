#include "../Interfaces/Diode.h"

#include <iostream>
#include <typeinfo>

Diode::Diode(const string &brand, const string &model, double forwardVoltage, double maxCurrent)
    : DiscreteSemiconductorDevice(brand, model), forwardVoltage(forwardVoltage), maxCurrent(maxCurrent) {}

Diode::Diode(const Diode &other)
    : DiscreteSemiconductorDevice(other), forwardVoltage(other.forwardVoltage), maxCurrent(other.maxCurrent) {}

Diode &Diode::operator=(const Diode &other)
{
    if (this != &other)
    {
        DiscreteSemiconductorDevice::operator=(other);
        forwardVoltage = other.forwardVoltage;
        maxCurrent = other.maxCurrent;
    }
    return *this;
}

Diode::~Diode() {}

double Diode::GetForwardVoltage() const
{
    return forwardVoltage;
}

double Diode::GetMaxCurrent() const
{
    return maxCurrent;
}

string Diode::ToString() const
{
    string result = DiscreteSemiconductorDevice::ToString();
    result += "\n\t\tForward Voltage: " + to_string(forwardVoltage) + " V";
    result += "\n\t\tMaximum Current: " + to_string(maxCurrent) + " A";
    return result;
}

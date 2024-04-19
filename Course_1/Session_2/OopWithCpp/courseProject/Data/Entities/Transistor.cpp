#include "../Interfaces/Transistor.h"

#include <iostream>
#include <typeinfo>

Transistor::Transistor(const string &brand, const string &model, double baseEmitterVoltage, double collectorCurrent)
    : DiscreteSemiconductorDevice(brand, model), baseEmitterVoltage(baseEmitterVoltage), collectorCurrent(collectorCurrent) {}

Transistor::Transistor(const Transistor &other)
    : DiscreteSemiconductorDevice(other), baseEmitterVoltage(other.baseEmitterVoltage), collectorCurrent(other.collectorCurrent) {}

Transistor &Transistor::operator=(const Transistor &other)
{
    if (this != &other)
    {
        DiscreteSemiconductorDevice::operator=(other);
        baseEmitterVoltage = other.baseEmitterVoltage;
        collectorCurrent = other.collectorCurrent;
    }
    return *this;
}

Transistor::~Transistor() {}

double Transistor::GetBaseEmitterVoltage() const
{
    return baseEmitterVoltage;
}

double Transistor::GetCollectorCurrent() const
{
    return collectorCurrent;
}

string Transistor::ToString() const
{
    string result = DiscreteSemiconductorDevice::ToString();
    result += "\n\t\tBase-Emitter Voltage: " + to_string(baseEmitterVoltage) + " V";
    result += "\n\t\tCollector Current: " + to_string(collectorCurrent) + " A";
    return result;
}

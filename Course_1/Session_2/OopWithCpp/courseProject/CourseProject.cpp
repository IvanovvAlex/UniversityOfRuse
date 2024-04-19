#include <iostream>
#include <typeinfo>

#include "./Data/Interfaces/DiscreteSemiconductorDevice.h"
#include "./Data/Entities/DiscreteSemiconductorDevice.cpp"
#include "./Data/Interfaces/Diode.h"
#include "./Data/Entities/Diode.cpp"
#include "./Data/Interfaces/Transistor.h"
#include "./Data/Entities/Transistor.cpp"
#include "./Data/Interfaces/Thyristor.h"
#include "./Data/Entities/Thyristor.cpp"
#include "./Data/Interfaces/ZenerDiode.h"
#include "./Data/Entities/ZenerDiode.cpp"
#include "./Data/Interfaces/TunableZenerDiode.h"
#include "./Data/Entities/TunableZenerDiode.cpp"

using namespace std;

int main()
{
    DiscreteSemiconductorDevice *devices[6];

    devices[0] = new DiscreteSemiconductorDevice("NXP", "BC547");
    devices[1] = new Diode("NXP", "BC557", 0.7, 0.1);
    devices[2] = new ZenerDiode("Philips", "BZX55C5V1", 0.7, 0.05, 5.1, 0.03);
    devices[3] = new TunableZenerDiode("Sony", "TZD100", 0.6, 0.04, 10.0, 0.02, 5, 1.0);
    devices[4] = new Transistor("Motorola", "2N3904", 0.6, 0.2);
    devices[5] = new Thyristor("STMicroelectronics", "T1234", 1.0, 1.5);

    // Demonstrating copy constructor
    Transistor transistorCopy = *(static_cast<Transistor *>(devices[2]));
    Thyristor thyristorCopy = *(static_cast<Thyristor *>(devices[3]));

    // Showing all device info
    for (int i = 0; i < 6; i++)
    {
        cout << devices[i]->ToString() << endl;
        if (auto di = dynamic_cast<DiscreteSemiconductorDevice *>(devices[i]))
        {
            cout << "\nAccessor Methods: " << endl;
            cout << "Brand: " << di->GetBrand() << endl;
            cout << "Model: " << di->GetModel() << endl;
        }
        else if (auto di = dynamic_cast<Diode *>(devices[i]))
        {
            cout << "\nAccessor Methods: " << endl;
            cout << "Forward Voltage: " << di->GetForwardVoltage() << " V" << endl;
            cout << "Max Current: " << di->GetMaxCurrent() << " A" << endl;
            if (auto zd = dynamic_cast<ZenerDiode *>(devices[i]))
            {
                cout << "Reverse Breakdown Voltage: " << zd->GetReverseBreakdownVoltage() << " V" << endl;
                cout << "Temperature Coefficient: " << zd->GetTemperatureCoefficient() << " %/C" << endl;
                if (auto tzd = dynamic_cast<TunableZenerDiode *>(devices[i]))
                {
                    cout << "Control Voltage: " << tzd->GetControlVoltage() << " V" << endl;
                    cout << "Adjustment Range: " << tzd->GetAdjustmentRange() << " V" << endl;
                }
            }
        }
        else if (auto tr = dynamic_cast<Transistor *>(devices[i]))
        {
            cout << "\nAccessor Methods: " << endl;
            cout << "Base-Emitter Voltage: " << tr->GetBaseEmitterVoltage() << " V" << endl;
            cout << "Collector Current: " << tr->GetCollectorCurrent() << " A" << endl;
        }
        else if (auto th = dynamic_cast<Thyristor *>(devices[i]))
        {
            cout << "\nAccessor Methods: " << endl;
            cout << "Gate Trigger Voltage: " << th->GetGateTriggerVoltage() << " V" << endl;
            cout << "Holding Current: " << th->GetHoldingCurrent() << " A" << endl;
        }
    }

    // Demonstrating the copy's independence
    cout << "\n\nCopy constructor examples:" << endl;
    cout << "\nOriginal Transistor:\n"
         << devices[4]->ToString() << endl;
    cout << "\nCopy of Transistor:\n"
         << transistorCopy.ToString() << endl;

    for (int i = 0; i < 6; i++)
    {
        if (devices[i])
        {
            delete devices[i];
        }
    }
    return 0;
}

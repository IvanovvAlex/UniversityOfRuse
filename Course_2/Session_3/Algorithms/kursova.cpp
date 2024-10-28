#include <iostream>
#include <string>
#include <list>

using namespace std;

// Структура за съхранение на информация за адрес и списък с жители
struct AddressInfo
{
    string address;
    list<string> residents;

    AddressInfo(const string &addr) : address(addr) {}
};

// Клас за управление на адреси и жители
class CommunityRegistry
{
private:
    list<AddressInfo> community;

public:
    // Добавяне на нов адрес
    void addAddress(const string &address)
    {
        community.push_back(AddressInfo(address));
        cout << "Добавен е нов адрес: " << address << endl;
    }

    // Добавяне на жител на даден адрес
    void addResident(const string &address, const string &resident)
    {
        for (auto &addrInfo : community)
        {
            if (addrInfo.address == address)
            {
                addrInfo.residents.push_back(resident);
                cout << "Добавен е жител: " << resident << " на адрес: " << address << endl;
                return;
            }
        }
        cout << "Адресът не е намерен." << endl;
    }

    // Брой на всички жители в общината
    int getTotalResidents() const
    {
        int total = 0;
        for (const auto &addrInfo : community)
        {
            total += addrInfo.residents.size();
        }
        return total;
    }
};

int main()
{
    CommunityRegistry registry;

    // Пример за добавяне на адреси и жители
    registry.addAddress("ул. Христо Ботев 10");
    registry.addResident("ул. Христо Ботев 10", "Иван Иванов");
    registry.addResident("ул. Христо Ботев 10", "Георги Георгиев");

    cout << "Общ брой жители: " << registry.getTotalResidents() << endl;

    return 0;
}
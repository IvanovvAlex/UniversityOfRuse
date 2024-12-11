#include <iostream>
#include <cstring>

using namespace std;

// Структура за един елемент в списъка
struct Node
{
    string address; // Адрес
    int residents;  // Брой жители
    Node *next;     // Указател към следващия елемент
};

// Функции за управление на динамичния списък
void addAddress(Node *&head, const string &address); // Добавяне на нов адрес
void addResident(Node *head, const string &address); // Добавяне на жител към адрес
void displayTotalResidents(Node *head);              // Показване на общия брой жители

int main()
{
    Node *head = nullptr; // Инициализиране на началото на списъка

    int choice;
    string address;

    // Основно меню
    while (true)
    {
        cout << "\nМеню:\n";
        cout << "1. Добавяне на нов адрес\n";
        cout << "2. Добавяне на жител към адрес\n";
        cout << "3. Показване на общия брой жители\n";
        cout << "4. Изход\n";
        cout << "Изберете опция: ";
        cin >> choice;

        switch (choice)
        {
        case 1:
            cout << "Въведете адрес: ";
            cin.ignore();          // Игнориране на символа за нов ред
            getline(cin, address); // Четене на адрес
            addAddress(head, address);
            break;
        case 2:
            cout << "Въведете адрес за добавяне на жител: ";
            cin.ignore();          // Игнориране на символа за нов ред
            getline(cin, address); // Четене на адрес
            addResident(head, address);
            break;
        case 3:
            displayTotalResidents(head);
            break;
        case 4:
            cout << "Изход от програмата.\n";
            return 0; // Излизане от програмата
        default:
            cout << "Невалидна опция. Опитайте отново.\n";
        }
    }
    return 0;
}

// Добавяне на нов адрес в списъка
void addAddress(Node *&head, const string &address)
{
    Node *newNode = new Node;   // Създаване на нов елемент
    newNode->address = address; // Задаване на адрес
    newNode->residents = 0;     // Брой жители по подразбиране е 0
    newNode->next = nullptr;    // Следващият елемент е nullptr

    // Добавяне на елемента в списъка
    if (head == nullptr)
    {
        head = newNode; // Ако списъкът е празен, новият елемент става начало
    }
    else
    {
        Node *temp = head;
        while (temp->next != nullptr)
        { // Намиране на последния елемент
            temp = temp->next;
        }
        temp->next = newNode; // Присвояване на новия елемент като последен
    }
    cout << "Адресът беше добавен успешно.\n";
}

// Добавяне на жител към конкретен адрес
void addResident(Node *head, const string &address)
{
    Node *temp = head;
    while (temp != nullptr)
    { // Обхождане на списъка
        if (temp->address == address)
        {                      // Проверка дали адресът съвпада
            temp->residents++; // Увеличаване на броя жители
            cout << "Жителят беше добавен успешно.\n";
            return;
        }
        temp = temp->next; // Преминаване към следващия елемент
    }
    cout << "Адресът не беше намерен.\n";
}

// Показване на общия брой жители
void displayTotalResidents(Node *head)
{
    int total = 0; // Общ брой жители
    Node *temp = head;
    while (temp != nullptr)
    {                             // Обхождане на списъка
        total += temp->residents; // Добавяне на броя жители за всеки адрес
        temp = temp->next;        // Преминаване към следващия елемент
    }
    cout << "Общ брой жители: " << total << endl;
}
#include <iostream>
using namespace std;

int main()
{
    string arr[3] = {"1","2","3"};

    for (int i = 2; i >= 0; i--)
        cout << arr[i];

    delete arr;
    for (int i = 2; i >= 0; i--)
        cout << arr[i];
}
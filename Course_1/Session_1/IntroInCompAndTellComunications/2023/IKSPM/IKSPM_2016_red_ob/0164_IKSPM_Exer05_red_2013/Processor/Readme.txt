Compatibality
Windows 95?, Windows 98, Windows 2000, Windows ME, Windows Wistler

BUG SUPPORT
The program work only if MS Office is installed on the computer.
It uses FM20.dll.
If MS Office is not installed, you can get FM20.dll from another computer and 
copy it to the system directory:

  copy fm20.dll c:\windows\system

than run:
  c:\windows\system\regsvr32 c:\windows\system\fm20.dll

Have a nice work.
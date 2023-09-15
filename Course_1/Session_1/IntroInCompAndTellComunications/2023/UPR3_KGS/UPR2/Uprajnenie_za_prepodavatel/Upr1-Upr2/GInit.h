#pragma once

class CGInit
{
public:
	CGInit(void);
	~CGInit(void);
	HWND CreateAppWindow(WNDPROC WinProc, LPCTSTR szWndName);
	HRESULT InitWindowed(HWND hWnd);
};

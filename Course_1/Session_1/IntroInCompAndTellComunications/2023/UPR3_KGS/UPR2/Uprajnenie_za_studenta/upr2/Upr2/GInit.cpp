#include "CGPrecomp.h"
#include "GInit.h"
#include "CGGlobals.h"

CGInit::CGInit(void)
{
}

CGInit::~CGInit(void)
{
}

HWND CGInit::CreateAppWindow(WNDPROC WinProc, LPCTSTR szWndName)
{
	WNDCLASSEX wc = {sizeof(WNDCLASSEX), CS_CLASSDC, WinProc, 0L, 0L, 
		GetModuleHandle(NULL), NULL, NULL, NULL, NULL,
		_T("CGApp"), NULL};
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	RegisterClassEx(&wc);
	//Create the application's window
	DWORD dwStyle = WS_POPUP;
	g_hWnd = CreateWindow(_T("CGApp"), szWndName, dwStyle, 0, 0, 800, 600, NULL, NULL, wc.hInstance, NULL);
	//Show our window
	ShowCursor(false);
	ShowWindow(g_hWnd, SW_SHOWDEFAULT);
	UpdateWindow(g_hWnd);
	return g_hWnd;
}

HRESULT CGInit::InitWindowed(HWND hWnd)
{
	//First of all, create the main D3D object. If it is created successfully we 
	//should get a pointer to an IDirect3D9 interface.
	
	

	//Get the current display mode
	D3DDISPLAYMODE d3ddm;
	if(FAILED(g_pD3D->GetAdapterDisplayMode(D3DADAPTER_DEFAULT, &d3ddm)))
		return E_FAIL;

	//Create a structure to hold the settings for our device
	
	
	// Use method ZeroMemory(...);
	

	//Fill the structure. 
	//We want our program to be windowed, and set the back buffer to a format
	//that matches our current display mode
	d3dpp.Windowed			= ........; //windowed screen
	d3dpp.SwapEffect		= ........;//throw away last frame
	d3dpp.BackBufferFormat	= d3ddm.Format;

	d3dpp.EnableAutoDepthStencil = ...........;
	d3dpp.AutoDepthStencilFormat = ...........; //depth stencil format
	d3dpp.MultiSampleType = ...........; //antialiasing
	d3dpp.PresentationInterval = ...........; 

	d3dpp.BackBufferWidth = ...........;
	d3dpp.BackBufferHeight = ...........;

	//Create a Direct3D device.
	...........;
	
	
	
	return S_OK; // InitWindowed() 
}

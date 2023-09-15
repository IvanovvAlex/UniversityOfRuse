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
	g_hr = CoInitialize(NULL); 
	g_pD3D = Direct3DCreate9(D3D_SDK_VERSION);

	if(g_pD3D == NULL)
	{
		CoUninitialize();
		return E_FAIL;
	}	

	//Get the current display mode
	D3DDISPLAYMODE d3ddm;
	if(FAILED(g_pD3D->GetAdapterDisplayMode(D3DADAPTER_DEFAULT, &d3ddm)))
		return E_FAIL;

	//Create a structure to hold the settings for our device
	D3DPRESENT_PARAMETERS d3dpp; 
	ZeroMemory(&d3dpp, sizeof(d3dpp));

	//Fill the structure. 
	//We want our program to be windowed, and set the back buffer to a format
	//that matches our current display mode
	d3dpp.Windowed			= false	;
	d3dpp.SwapEffect		= D3DSWAPEFFECT_DISCARD;
	d3dpp.BackBufferFormat	= d3ddm.Format;

	d3dpp.EnableAutoDepthStencil = true;
	d3dpp.AutoDepthStencilFormat = D3DFMT_D24S8;
	d3dpp.MultiSampleType = D3DMULTISAMPLE_2_SAMPLES;
	d3dpp.PresentationInterval = D3DPRESENT_INTERVAL_IMMEDIATE;

	d3dpp.BackBufferWidth = 800;
	d3dpp.BackBufferHeight = 600;

	//Create a Direct3D device.
	if(FAILED(g_hr = g_pD3D->CreateDevice(D3DADAPTER_DEFAULT, D3DDEVTYPE_HAL, hWnd, 
		D3DCREATE_MIXED_VERTEXPROCESSING, &d3dpp, &g_pD3DDevice)))
	{
		if(FAILED(g_hr = g_pD3D->CreateDevice(D3DADAPTER_DEFAULT, D3DDEVTYPE_HAL, hWnd, 
			D3DCREATE_SOFTWARE_VERTEXPROCESSING, &d3dpp, &g_pD3DDevice)))
		{
			return E_FAIL;
		}
	}
	return S_OK;
}

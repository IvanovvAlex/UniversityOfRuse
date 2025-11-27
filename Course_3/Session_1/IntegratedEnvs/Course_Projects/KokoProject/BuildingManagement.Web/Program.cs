WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<BuildingManagement.Web.Api.ApiSettings>(
    builder.Configuration.GetSection("ApiSettings"));
builder.Services.AddHttpClient<BuildingManagement.Web.Api.Buildings.IBuildingsApiClient, BuildingManagement.Web.Api.Buildings.BuildingsApiClient>();
builder.Services.AddHttpClient<BuildingManagement.Web.Api.Apartments.IApartmentsApiClient, BuildingManagement.Web.Api.Apartments.ApartmentsApiClient>();
builder.Services.AddHttpClient<BuildingManagement.Web.Api.Residents.IResidentsApiClient, BuildingManagement.Web.Api.Residents.ResidentsApiClient>();
builder.Services.AddHttpClient<BuildingManagement.Web.Api.Payments.IPaymentsApiClient, BuildingManagement.Web.Api.Payments.PaymentsApiClient>();
builder.Services.AddHttpClient<BuildingManagement.Web.Api.FeeTypes.IFeeTypesApiClient, BuildingManagement.Web.Api.FeeTypes.FeeTypesApiClient>();
builder.Services.AddControllersWithViews();

WebApplication app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();

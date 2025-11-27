using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Web.Api.Apartments;
using BuildingManagement.Web.Api.Buildings;
using BuildingManagement.Web.Api.Payments;
using BuildingManagement.Web.Api.Residents;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BuildingManagement.Web.Controllers;

public class ExportController : Controller
{
    private readonly IBuildingsApiClient buildingsApiClient;
    private readonly IApartmentsApiClient apartmentsApiClient;
    private readonly IResidentsApiClient residentsApiClient;
    private readonly IPaymentsApiClient paymentsApiClient;

    public ExportController(
        IBuildingsApiClient buildingsApiClient,
        IApartmentsApiClient apartmentsApiClient,
        IResidentsApiClient residentsApiClient,
        IPaymentsApiClient paymentsApiClient)
    {
        this.buildingsApiClient = buildingsApiClient;
        this.apartmentsApiClient = apartmentsApiClient;
        this.residentsApiClient = residentsApiClient;
        this.paymentsApiClient = paymentsApiClient;
    }

    public async Task<IActionResult> ExportToExcel()
    {
        using XLWorkbook workbook = new XLWorkbook();

        IReadOnlyCollection<BuildingManagement.Common.Buildings.BuildingDto> buildings = await this.buildingsApiClient.GetAllAsync();
        IReadOnlyCollection<BuildingManagement.Common.Apartments.ApartmentDto> apartments = await this.apartmentsApiClient.GetAllAsync();
        IReadOnlyCollection<BuildingManagement.Common.Residents.ResidentDto> residents = await this.residentsApiClient.GetAllAsync();
        IReadOnlyCollection<BuildingManagement.Common.Payments.PaymentDto> payments = await this.paymentsApiClient.GetAllAsync();

        IXLWorksheet buildingsSheet = workbook.Worksheets.Add("Сгради");
        AddBuildingsData(buildingsSheet, buildings);

        IXLWorksheet apartmentsSheet = workbook.Worksheets.Add("Апартаменти");
        AddApartmentsData(apartmentsSheet, apartments);

        IXLWorksheet residentsSheet = workbook.Worksheets.Add("Жители");
        AddResidentsData(residentsSheet, residents);

        IXLWorksheet paymentsSheet = workbook.Worksheets.Add("Плащания");
        AddPaymentsData(paymentsSheet, payments);

        using MemoryStream stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        string fileName = $"BuildingManagement_Export_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }

    private static void AddBuildingsData(IXLWorksheet worksheet, IReadOnlyCollection<BuildingManagement.Common.Buildings.BuildingDto> buildings)
    {
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "Име";
        worksheet.Cell(1, 3).Value = "Адрес";
        worksheet.Cell(1, 4).Value = "Вход";
        worksheet.Cell(1, 5).Value = "Бележки";

        IXLRange headerRange = worksheet.Range(1, 1, 1, 5);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

        int row = 2;
        foreach (BuildingManagement.Common.Buildings.BuildingDto building in buildings)
        {
            worksheet.Cell(row, 1).Value = building.Id;
            worksheet.Cell(row, 2).Value = building.Name;
            worksheet.Cell(row, 3).Value = building.Address;
            worksheet.Cell(row, 4).Value = building.Entrance?.ToString() ?? string.Empty;
            worksheet.Cell(row, 5).Value = building.Notes ?? string.Empty;
            row++;
        }

        worksheet.Columns().AdjustToContents();
    }

    private static void AddApartmentsData(IXLWorksheet worksheet, IReadOnlyCollection<BuildingManagement.Common.Apartments.ApartmentDto> apartments)
    {
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "ID Сграда";
        worksheet.Cell(1, 3).Value = "Номер";
        worksheet.Cell(1, 4).Value = "Етаж";
        worksheet.Cell(1, 5).Value = "Площ (м²)";
        worksheet.Cell(1, 6).Value = "Бележки";

        IXLRange headerRange = worksheet.Range(1, 1, 1, 6);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

        int row = 2;
        foreach (BuildingManagement.Common.Apartments.ApartmentDto apartment in apartments)
        {
            worksheet.Cell(row, 1).Value = apartment.Id;
            worksheet.Cell(row, 2).Value = apartment.BuildingId;
            worksheet.Cell(row, 3).Value = apartment.ApartmentNumber;
            worksheet.Cell(row, 4).Value = apartment.Floor;
            worksheet.Cell(row, 5).Value = apartment.Area?.ToString("F2") ?? string.Empty;
            worksheet.Cell(row, 6).Value = apartment.Notes ?? string.Empty;
            row++;
        }

        worksheet.Columns().AdjustToContents();
    }

    private static void AddResidentsData(IXLWorksheet worksheet, IReadOnlyCollection<BuildingManagement.Common.Residents.ResidentDto> residents)
    {
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "ID Апартамент";
        worksheet.Cell(1, 3).Value = "Номер Апартамент";
        worksheet.Cell(1, 4).Value = "Пълно име";
        worksheet.Cell(1, 5).Value = "Телефон";
        worksheet.Cell(1, 6).Value = "Имейл";
        worksheet.Cell(1, 7).Value = "Собственик";

        IXLRange headerRange = worksheet.Range(1, 1, 1, 7);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

        int row = 2;
        foreach (BuildingManagement.Common.Residents.ResidentDto resident in residents)
        {
            worksheet.Cell(row, 1).Value = resident.Id;
            worksheet.Cell(row, 2).Value = resident.ApartmentId;
            worksheet.Cell(row, 3).Value = resident.ApartmentNumber;
            worksheet.Cell(row, 4).Value = resident.FullName;
            worksheet.Cell(row, 5).Value = resident.Phone;
            worksheet.Cell(row, 6).Value = resident.Email ?? string.Empty;
            worksheet.Cell(row, 7).Value = resident.IsOwner ? "Да" : "Не";
            row++;
        }

        worksheet.Columns().AdjustToContents();
    }

    private static void AddPaymentsData(IXLWorksheet worksheet, IReadOnlyCollection<BuildingManagement.Common.Payments.PaymentDto> payments)
    {
        worksheet.Cell(1, 1).Value = "ID";
        worksheet.Cell(1, 2).Value = "ID Жител";
        worksheet.Cell(1, 3).Value = "Име на жител";
        worksheet.Cell(1, 4).Value = "ID Тип такса";
        worksheet.Cell(1, 5).Value = "Тип такса";
        worksheet.Cell(1, 6).Value = "Сума (лв.)";
        worksheet.Cell(1, 7).Value = "Дата на плащане";
        worksheet.Cell(1, 8).Value = "Месец за";

        IXLRange headerRange = worksheet.Range(1, 1, 1, 8);
        headerRange.Style.Font.Bold = true;
        headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

        int row = 2;
        foreach (BuildingManagement.Common.Payments.PaymentDto payment in payments)
        {
            worksheet.Cell(row, 1).Value = payment.Id;
            worksheet.Cell(row, 2).Value = payment.ResidentId;
            worksheet.Cell(row, 3).Value = payment.ResidentName;
            worksheet.Cell(row, 4).Value = payment.FeeTypeId;
            worksheet.Cell(row, 5).Value = payment.FeeTypeName;
            worksheet.Cell(row, 6).Value = payment.Amount;
            worksheet.Cell(row, 7).Value = payment.PaymentDate.ToString("dd.MM.yyyy");
            worksheet.Cell(row, 8).Value = payment.MonthFor;
            row++;
        }

        worksheet.Columns().AdjustToContents();
    }
}


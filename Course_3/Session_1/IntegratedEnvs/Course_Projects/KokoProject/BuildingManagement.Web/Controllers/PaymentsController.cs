using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;
using BuildingManagement.Common.Payments;
using BuildingManagement.Web.Api.FeeTypes;
using BuildingManagement.Web.Api.Payments;
using BuildingManagement.Web.Models.Payments;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace BuildingManagement.Web.Controllers;

public class PaymentsController : Controller
{
    private readonly IPaymentsApiClient paymentsApiClient;
    private readonly IFeeTypesApiClient feeTypesApiClient;

    public PaymentsController(IPaymentsApiClient paymentsApiClient, IFeeTypesApiClient feeTypesApiClient)
    {
        this.paymentsApiClient = paymentsApiClient;
        this.feeTypesApiClient = feeTypesApiClient;
    }

    public async Task<IActionResult> Index()
    {
        IReadOnlyCollection<PaymentDto> payments = await this.paymentsApiClient.GetAllAsync();
        return View(payments);
    }

    public async Task<IActionResult> Create(int residentId)
    {
        PaymentDto model = new PaymentDto
        {
            ResidentId = residentId,
            PaymentDate = DateTime.Today
        };

        IReadOnlyCollection<FeeTypeDto> feeTypes = await this.feeTypesApiClient.GetAllAsync();
        List<SelectListItem> feeTypeItems = feeTypes
            .Select(f => new SelectListItem { Value = f.Id.ToString(), Text = f.Name })
            .ToList();

        PaymentFormViewModel viewModel = new PaymentFormViewModel
        {
            Payment = model,
            FeeTypes = feeTypeItems
        };

        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(PaymentFormViewModel viewModel)
    {
        if (!this.ModelState.IsValid)
        {
            await this.PopulateFeeTypesAsync(viewModel);
            return View(viewModel);
        }

        await this.paymentsApiClient.CreateAsync(viewModel.Payment);
        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Edit(int id)
    {
        PaymentDto? dto = await this.paymentsApiClient.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        IReadOnlyCollection<FeeTypeDto> feeTypes = await this.feeTypesApiClient.GetAllAsync();
        List<SelectListItem> feeTypeItems = feeTypes
            .Select(f => new SelectListItem { Value = f.Id.ToString(), Text = f.Name })
            .ToList();

        PaymentFormViewModel viewModel = new PaymentFormViewModel
        {
            Payment = dto,
            FeeTypes = feeTypeItems
        };

        return View(viewModel);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, PaymentFormViewModel viewModel)
    {
        if (!this.ModelState.IsValid)
        {
            await this.PopulateFeeTypesAsync(viewModel);
            return View(viewModel);
        }

        bool updated = await this.paymentsApiClient.UpdateAsync(id, viewModel.Payment);
        if (!updated)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    public async Task<IActionResult> Delete(int id)
    {
        PaymentDto? dto = await this.paymentsApiClient.GetByIdAsync(id);
        if (dto == null)
        {
            return NotFound();
        }

        return View(dto);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [ActionName("Delete")]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        await this.paymentsApiClient.DeleteAsync(id);
        return RedirectToAction(nameof(Index));
    }

    private async Task PopulateFeeTypesAsync(PaymentFormViewModel viewModel)
    {
        IReadOnlyCollection<FeeTypeDto> feeTypes = await this.feeTypesApiClient.GetAllAsync();
        List<SelectListItem> feeTypeItems = feeTypes
            .Select(f => new SelectListItem { Value = f.Id.ToString(), Text = f.Name })
            .ToList();
        viewModel.FeeTypes = feeTypeItems;
    }
}


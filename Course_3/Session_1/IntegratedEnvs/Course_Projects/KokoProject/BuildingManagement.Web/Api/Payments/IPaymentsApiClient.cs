using System.Collections.Generic;
using System.Threading.Tasks;
using BuildingManagement.Common.Payments;

namespace BuildingManagement.Web.Api.Payments;

public interface IPaymentsApiClient
{
    Task<IReadOnlyCollection<PaymentDto>> GetAllAsync();

    Task<PaymentDto?> GetByIdAsync(int id);

    Task<PaymentDto> CreateAsync(PaymentDto dto);

    Task<bool> UpdateAsync(int id, PaymentDto dto);

    Task<bool> DeleteAsync(int id);
}



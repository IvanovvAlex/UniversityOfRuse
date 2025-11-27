using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BuildingManagement.Common.Payments;
using BuildingManagement.Data;
using BuildingManagement.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildingManagement.Domain.Payments;

public class PaymentService : IPaymentService
{
    private readonly BuildingManagementDbContext dbContext;

    public PaymentService(BuildingManagementDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IReadOnlyCollection<PaymentDto>> GetAllAsync()
    {
        List<Payment> entities = await this.dbContext.Payments
            .AsNoTracking()
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();

        List<PaymentDto> result = entities
            .Select(ToDto)
            .ToList();

        return result;
    }

    public async Task<PaymentDto?> GetByIdAsync(int id)
    {
        Payment? entity = await this.dbContext.Payments
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
        {
            return null;
        }

        PaymentDto dto = ToDto(entity);
        return dto;
    }

    public async Task<PaymentDto> CreateAsync(PaymentDto dto)
    {
        DateTime normalizedPaymentDate = NormalizeToUtc(dto.PaymentDate);

        Payment entity = new Payment
        {
            ResidentId = dto.ResidentId,
            FeeTypeId = dto.FeeTypeId,
            Amount = dto.Amount,
            PaymentDate = normalizedPaymentDate,
            MonthFor = dto.MonthFor
        };

        this.dbContext.Payments.Add(entity);
        await this.dbContext.SaveChangesAsync();

        dto.Id = entity.Id;
        return dto;
    }

    public async Task<bool> UpdateAsync(int id, PaymentDto dto)
    {
        Payment? entity = await this.dbContext.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (entity == null)
        {
            return false;
        }

        DateTime normalizedPaymentDate = NormalizeToUtc(dto.PaymentDate);

        entity.ResidentId = dto.ResidentId;
        entity.FeeTypeId = dto.FeeTypeId;
        entity.Amount = dto.Amount;
        entity.PaymentDate = normalizedPaymentDate;
        entity.MonthFor = dto.MonthFor;

        await this.dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        Payment? entity = await this.dbContext.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (entity == null)
        {
            return false;
        }

        this.dbContext.Payments.Remove(entity);
        await this.dbContext.SaveChangesAsync();
        return true;
    }

    private static PaymentDto ToDto(Payment entity)
    {
        PaymentDto dto = new PaymentDto
        {
            Id = entity.Id,
            ResidentId = entity.ResidentId,
            FeeTypeId = entity.FeeTypeId,
            Amount = entity.Amount,
            PaymentDate = entity.PaymentDate,
            MonthFor = entity.MonthFor
        };
        return dto;
    }

    private static DateTime NormalizeToUtc(DateTime value)
    {
        if (value.Kind == DateTimeKind.Utc)
        {
            return value;
        }

        if (value.Kind == DateTimeKind.Local)
        {
            return value.ToUniversalTime();
        }

        DateTime utcValue = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        return utcValue;
    }
}



using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BuildingManagement.Common.Payments;
using Microsoft.Extensions.Options;

namespace BuildingManagement.Web.Api.Payments;

public class PaymentsApiClient : IPaymentsApiClient
{
    private readonly HttpClient httpClient;

    public PaymentsApiClient(HttpClient httpClient, IOptions<ApiSettings> options)
    {
        this.httpClient = httpClient;
        string baseUrl = options.Value.BaseUrl.TrimEnd('/');
        this.httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<IReadOnlyCollection<PaymentDto>> GetAllAsync()
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/payments");
        response.EnsureSuccessStatusCode();

        PaymentDto[]? data = await response.Content.ReadFromJsonAsync<PaymentDto[]>();
        if (data == null)
        {
            return Array.Empty<PaymentDto>();
        }

        return data;
    }

    public async Task<PaymentDto?> GetByIdAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/payments/" + id);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        PaymentDto? dto = await response.Content.ReadFromJsonAsync<PaymentDto>();
        return dto;
    }

    public async Task<PaymentDto> CreateAsync(PaymentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PostAsJsonAsync("api/payments", dto);
        response.EnsureSuccessStatusCode();

        PaymentDto? created = await response.Content.ReadFromJsonAsync<PaymentDto>();
        if (created == null)
        {
            return dto;
        }

        return created;
    }

    public async Task<bool> UpdateAsync(int id, PaymentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PutAsJsonAsync("api/payments/" + id, dto);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.DeleteAsync("api/payments/" + id);
        return response.IsSuccessStatusCode;
    }
}



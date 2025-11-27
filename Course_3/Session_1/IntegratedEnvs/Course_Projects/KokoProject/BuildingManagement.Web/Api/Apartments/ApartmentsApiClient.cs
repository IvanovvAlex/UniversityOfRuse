using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BuildingManagement.Common.Apartments;
using Microsoft.Extensions.Options;

namespace BuildingManagement.Web.Api.Apartments;

public class ApartmentsApiClient : IApartmentsApiClient
{
    private readonly HttpClient httpClient;

    public ApartmentsApiClient(HttpClient httpClient, IOptions<ApiSettings> options)
    {
        this.httpClient = httpClient;
        string baseUrl = options.Value.BaseUrl.TrimEnd('/');
        this.httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<IReadOnlyCollection<ApartmentDto>> GetAllAsync()
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/apartments");
        response.EnsureSuccessStatusCode();

        ApartmentDto[]? data = await response.Content.ReadFromJsonAsync<ApartmentDto[]>();
        if (data == null)
        {
            return Array.Empty<ApartmentDto>();
        }

        return data;
    }

    public async Task<ApartmentDto?> GetByIdAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/apartments/" + id);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        ApartmentDto? dto = await response.Content.ReadFromJsonAsync<ApartmentDto>();
        return dto;
    }

    public async Task<ApartmentDto> CreateAsync(ApartmentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PostAsJsonAsync("api/apartments", dto);
        response.EnsureSuccessStatusCode();

        ApartmentDto? created = await response.Content.ReadFromJsonAsync<ApartmentDto>();
        if (created == null)
        {
            return dto;
        }

        return created;
    }

    public async Task<bool> UpdateAsync(int id, ApartmentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PutAsJsonAsync("api/apartments/" + id, dto);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.DeleteAsync("api/apartments/" + id);
        return response.IsSuccessStatusCode;
    }
}



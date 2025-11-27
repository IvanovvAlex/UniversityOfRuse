using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BuildingManagement.Common.Residents;
using Microsoft.Extensions.Options;

namespace BuildingManagement.Web.Api.Residents;

public class ResidentsApiClient : IResidentsApiClient
{
    private readonly HttpClient httpClient;

    public ResidentsApiClient(HttpClient httpClient, IOptions<ApiSettings> options)
    {
        this.httpClient = httpClient;
        string baseUrl = options.Value.BaseUrl.TrimEnd('/');
        this.httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<IReadOnlyCollection<ResidentDto>> GetAllAsync()
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/residents");
        response.EnsureSuccessStatusCode();

        ResidentDto[]? data = await response.Content.ReadFromJsonAsync<ResidentDto[]>();
        if (data == null)
        {
            return Array.Empty<ResidentDto>();
        }

        return data;
    }

    public async Task<ResidentDto?> GetByIdAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/residents/" + id);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        ResidentDto? dto = await response.Content.ReadFromJsonAsync<ResidentDto>();
        return dto;
    }

    public async Task<ResidentDto> CreateAsync(ResidentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PostAsJsonAsync("api/residents", dto);
        response.EnsureSuccessStatusCode();

        ResidentDto? created = await response.Content.ReadFromJsonAsync<ResidentDto>();
        if (created == null)
        {
            return dto;
        }

        return created;
    }

    public async Task<bool> UpdateAsync(int id, ResidentDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PutAsJsonAsync("api/residents/" + id, dto);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.DeleteAsync("api/residents/" + id);
        return response.IsSuccessStatusCode;
    }
}



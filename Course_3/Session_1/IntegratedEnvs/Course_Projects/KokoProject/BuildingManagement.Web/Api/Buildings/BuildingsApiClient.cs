using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BuildingManagement.Common.Buildings;
using Microsoft.Extensions.Options;

namespace BuildingManagement.Web.Api.Buildings;

public class BuildingsApiClient : IBuildingsApiClient
{
    private readonly HttpClient httpClient;

    public BuildingsApiClient(HttpClient httpClient, IOptions<BuildingManagement.Web.Api.ApiSettings> options)
    {
        this.httpClient = httpClient;
        string baseUrl = options.Value.BaseUrl.TrimEnd('/');
        this.httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<IReadOnlyCollection<BuildingDto>> GetAllAsync()
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/buildings");
        response.EnsureSuccessStatusCode();

        BuildingDto[]? data = await response.Content.ReadFromJsonAsync<BuildingDto[]>();
        if (data == null)
        {
            return Array.Empty<BuildingDto>();
        }

        return data;
    }

    public async Task<BuildingDto?> GetByIdAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/buildings/" + id);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        BuildingDto? dto = await response.Content.ReadFromJsonAsync<BuildingDto>();
        return dto;
    }

    public async Task<BuildingDto> CreateAsync(BuildingDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PostAsJsonAsync("api/buildings", dto);
        response.EnsureSuccessStatusCode();

        BuildingDto? created = await response.Content.ReadFromJsonAsync<BuildingDto>();
        if (created == null)
        {
            return dto;
        }

        return created;
    }

    public async Task<bool> UpdateAsync(int id, BuildingDto dto)
    {
        HttpResponseMessage response = await this.httpClient.PutAsJsonAsync("api/buildings/" + id, dto);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        HttpResponseMessage response = await this.httpClient.DeleteAsync("api/buildings/" + id);
        return response.IsSuccessStatusCode;
    }
}

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using BuildingManagement.Common.FeeTypes;
using Microsoft.Extensions.Options;

namespace BuildingManagement.Web.Api.FeeTypes;

public class FeeTypesApiClient : IFeeTypesApiClient
{
    private readonly HttpClient httpClient;

    public FeeTypesApiClient(HttpClient httpClient, IOptions<ApiSettings> options)
    {
        this.httpClient = httpClient;
        string baseUrl = options.Value.BaseUrl.TrimEnd('/');
        this.httpClient.BaseAddress = new Uri(baseUrl);
    }

    public async Task<IReadOnlyCollection<FeeTypeDto>> GetAllAsync()
    {
        HttpResponseMessage response = await this.httpClient.GetAsync("api/feetypes");
        response.EnsureSuccessStatusCode();

        FeeTypeDto[]? data = await response.Content.ReadFromJsonAsync<FeeTypeDto[]>();
        if (data == null)
        {
            return Array.Empty<FeeTypeDto>();
        }

        return data;
    }
}



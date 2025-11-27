using System.Collections.Generic;
using System.Linq;
using BuildingManagement.Data.Entities;

namespace BuildingManagement.Data;

public static class DbSeeder
{
    public static void Seed(BuildingManagementDbContext dbContext)
    {
        SeedFeeTypes(dbContext);
    }

    private static void SeedFeeTypes(BuildingManagementDbContext dbContext)
    {
        bool anyFeeTypes = dbContext.FeeTypes.Any();
        if (anyFeeTypes)
        {
            return;
        }

        List<FeeType> defaultFeeTypes = new List<FeeType>
        {
            new FeeType
            {
                Name = "Поддръжка на сграда",
                Description = "Месечна такса за поддръжка на общите части и услуги."
            },
            new FeeType
            {
                Name = "Асансьор",
                Description = "Такса за поддръжка и експлоатация на асансьора."
            },
            new FeeType
            {
                Name = "Почистване",
                Description = "Услуги за почистване на общите части на сградата."
            },
            new FeeType
            {
                Name = "Резервен фонд",
                Description = "Резервен фонд за бъдещи ремонти и подобрения."
            }
        };

        dbContext.FeeTypes.AddRange(defaultFeeTypes);
        dbContext.SaveChanges();
    }
}



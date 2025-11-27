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
                Name = "Building Maintenance",
                Description = "Monthly maintenance fee for common areas and services."
            },
            new FeeType
            {
                Name = "Elevator",
                Description = "Elevator maintenance and operation fee."
            },
            new FeeType
            {
                Name = "Cleaning",
                Description = "Cleaning services for common parts of the building."
            },
            new FeeType
            {
                Name = "Reserve Fund",
                Description = "Reserve fund for future repairs and improvements."
            }
        };

        dbContext.FeeTypes.AddRange(defaultFeeTypes);
        dbContext.SaveChanges();
    }
}



using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace prid_2324_a13.Models;

    public class DatabaseDTO
    {

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

    }


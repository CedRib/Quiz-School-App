using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2324_a13.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using prid_2324_a13.Helpers;

namespace prid_2324.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly MyContext _context;
        private readonly IMapper _mapper;

        public DatabaseController(MyContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [Authorized(Role.Teacher, Role.Student)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DatabaseDTO>>> GetDatabases()
        {
            var databases = await _context.Databases.ToListAsync();
            return _mapper.Map<List<DatabaseDTO>>(databases);
        }
    }
}

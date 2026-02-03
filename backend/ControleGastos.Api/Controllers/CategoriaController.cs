using ControleGastos.Application.Dtos;
using ControleGastos.Application.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriaController(CategoriaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoriaDto.CategoriaRequest request, CancellationToken token)
        {
            await _service.CreateCategoria(request, token);
            return Created("", new { message = "Criado com sucesso." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] CategoriaDto.CategoriaRequest request, Guid id, CancellationToken token)
        {
            await _service.UpdateCategoria(id, request, token);
            return Ok("Atualizado com sucesso.");
        }


        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            var categorias = await _service.GetAllCategoria(token);
            return Ok(categorias);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id,CancellationToken token)
        {
            var categoria = await _service.GetCategoria(id, token);
            return Ok(categoria);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id,CancellationToken token)
        {
            await _service.DeleteCategoria(id,token);
            return Ok("Deletado com sucesso.");
        }




    }
}

using ControleGastos.Application.Dtos;
using ControleGastos.Application.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PessoaController : ControllerBase
    {
        private readonly PessoaService _service;

        public PessoaController(PessoaService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PessoaDto.PessoaRequest request, CancellationToken token)
        {
            await _service.CreatePessoa(request, token);
            return Created();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] PessoaDto.PessoaRequest request, Guid id, CancellationToken token)
        {
            await _service.UpdatePessoa(id, request, token);
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken token)
        {
            var response = await _service.GetPessoa(id, token);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            var response = await _service.GetAllPessoas(token);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken token)
        {
            await _service.DeletePessoa(id, token);
            return Ok();
        }

    }
}

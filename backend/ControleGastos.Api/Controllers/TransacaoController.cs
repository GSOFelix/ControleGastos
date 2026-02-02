using ControleGastos.Application.Dtos;
using ControleGastos.Application.Service;
using ControleGastos.Application.UseCase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        private readonly CriarTransacaoUseCase _criarTransacaoUseCase;
        private readonly RelatorioTransacaoPorPessoaUseCase _relatorioTransacaoPorPessoaUseCase;
        private readonly RelatorioTransacaoPorCategoriaUseCase _relatorioTransacaoPorCategoriaUseCase;
        private readonly TransacaoService _service;

        public TransacaoController(
            CriarTransacaoUseCase criarTransacaoUseCase,
            RelatorioTransacaoPorPessoaUseCase relatorioTransacaoPorPessoaUseCase,
            RelatorioTransacaoPorCategoriaUseCase relatorioTransacaoPorCategoriaUseCase,
            TransacaoService service
            )
        {
            _criarTransacaoUseCase = criarTransacaoUseCase;
            _relatorioTransacaoPorPessoaUseCase = relatorioTransacaoPorPessoaUseCase;
            _relatorioTransacaoPorCategoriaUseCase = relatorioTransacaoPorCategoriaUseCase;
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransacaoDto.TransacaoRequest request, CancellationToken token)
        {
            await _criarTransacaoUseCase.CreateTransacao(request, token);
            return Created("", new { message = "Criado com sucesso." });
        }

        [HttpGet("relatorio-pessoa")]
        public async Task<IActionResult> SelectTotalPessoa(CancellationToken token)
        {
            var totaisPessoa = await _relatorioTransacaoPorPessoaUseCase.RelatorioPessoaResponse(token);
            return Ok(totaisPessoa);
        }

        [HttpGet("relatorio-categoria")]
        public async Task<IActionResult> SelectTotalCategoria(CancellationToken token)
        {
            var totaisCategoria = await _relatorioTransacaoPorCategoriaUseCase.RelatorioCategoriaResponse(token);
            return Ok(totaisCategoria);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id, CancellationToken token)
        {
            var trasnsacao = await _service.GetTransacao(id, token);
            return Ok(trasnsacao);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken token)
        {
            var transacoes = await _service.GetAllTransacao(token);
            return Ok(transacoes);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromBody] TransacaoDto.TransacaoRequest request, Guid id, CancellationToken token)
        {
            await _service.UpdateTransacao(request, id, token);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken token)
        {
            await _service.DeleteTransacao(id, token);
            return Ok();
        }



    }
}

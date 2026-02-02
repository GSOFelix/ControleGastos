using ControleGastos.Domain.Exceptions;
using ControleGastos.Shared.Exceptions;
using ControleGastos.Shared.Model;
using FluentValidation;
using System.Net;
using System.Text.Json;

namespace ControleGastos.Api.Middlewares
{
    /// <summary>
    /// Middleware global responsável por interceptar todas as exceções da aplicação.
    ///
    /// A ideia é centralizar o tratamento de erros em um único ponto,
    /// evitando try/catch espalhado em controllers e serviços.
    ///
    /// Cada tipo de exceção é convertido para um StatusCode HTTP adequado,
    /// mantendo o padrão de resposta da API.
    /// </summary>
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        /// <summary>
        /// Executa o próximo middleware da pipeline.
        /// Caso alguma exceção seja lançada, ela é capturada
        /// e tratada de forma padronizada.
        /// </summary>
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandlerException(ex, context);
            }
        }

        /// <summary>
        /// Converte exceções de domínio/aplicação em respostas HTTP.
        ///
        /// Aqui é feito:
        /// - mapeamento do status code
        /// - padronização da mensagem
        /// - retorno em JSON
        ///
        /// Dessa forma o front sempre recebe um formato consistente de erro.
        /// </summary>
        private static Task HandlerException(Exception ex, HttpContext context)
        {
            var statusCode = ex switch
            {
                // erros de validação de DTO (FluentValidation)
                ValidationException => HttpStatusCode.BadRequest,

                // entidade não encontrada
                NotFoundException => HttpStatusCode.NotFound,

                // requisição inválida
                BadRequestException => HttpStatusCode.BadRequest,

                // regra de negócio violada
                BusinessException => HttpStatusCode.UnprocessableContent,

                // validações do domínio (invariantes da entidade)
                DomainExceptions => HttpStatusCode.BadRequest,

                // erro inesperado
                _ => HttpStatusCode.InternalServerError
            };

            // se for ValidationException, retorno todas as mensagens
            // caso contrário, apenas a mensagem simples
            object message = ex switch
            {
                ValidationException validation =>
                    validation.Errors.Select(e => e.ErrorMessage),
                _ => ex.Message
            };

            var response = new ErrorResponse
            {
                StatusCode = (int)statusCode,
                Message = message,
                Path = context.Request.Path,
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsJsonAsync(response);
        }
    }

}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace ControleGastos.Domain.Exceptions
{
    public class DomainExceptions : Exception
    {
        public DomainExceptions(string error) : base(error) { }

        public static void When(bool hasError, string message)
        {
            if(hasError)
                throw new DomainExceptions(message);
        }
        
    }
}

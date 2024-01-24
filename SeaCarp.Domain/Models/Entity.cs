using Microsoft.EntityFrameworkCore.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace SeaCarp.Domain.Models;

public abstract class Entity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; private set; }

    protected ILazyLoader LazyLoader { get; set; }

    protected Entity(int id)
    {
        Id = id;
    }
}

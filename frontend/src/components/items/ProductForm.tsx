import { ItemType } from '@/models/Product';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const formSchema = z.object({
  id_product: z.number().int().positive(),
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.nativeEnum(ItemType),
  returns_date: z.number().int().min(0, 'La fecha de devolución debe ser un número positivo'),
})

type FormData = z.infer<typeof formSchema>

function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_product: 0,
      name: '',
      type: ItemType.PRODUCT,
      returns_date: 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    console.log(data)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Ingrese el nombre del producto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Producto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ItemType.NEWSPAPER}>Periódico</SelectItem>
                  <SelectItem value={ItemType.PRODUCT}>Producto</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione el tipo de producto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="returns_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Días de Devolución</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormDescription>
                Ingrese el número de días para la devolución.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
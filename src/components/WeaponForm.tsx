"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const damageEntrySchema = z.object({
  id: z.number().optional(),
  distance: z.number().min(0, "Distance must be non-negative"),
  damage: z.number().min(1, "Damage must be at least 1"),
});

const loadoutEntrySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Loadout name is required"),
  bulletVelocity: z.number().min(1, "Bullet velocity must be at least 1"),
});

const weaponFormSchema = z.object({
  name: z.string().min(1, "Weapon name is required"),
  categoryId: z.number().min(1, "Category is required"),
  fireRate: z.number().min(1, "Fire rate must be at least 1"),
  magazine: z.number().min(1, "Magazine must be at least 1"),
  reloadTime: z.number().min(0.1, "Reload time must be at least 0.1"),
  damages: z
    .array(damageEntrySchema)
    .min(1, "At least one damage entry is required"),
  loadouts: z
    .array(loadoutEntrySchema)
    .min(1, "At least one loadout is required"),
});

export type WeaponFormData = z.infer<typeof weaponFormSchema>;

export interface WeaponCategory {
  id: number;
  name: string;
}

interface WeaponFormProps {
  initialData: WeaponFormData;
  onSubmit: (data: WeaponFormData) => Promise<void>;
  categories: WeaponCategory[];
}

export default function WeaponForm({
  initialData,
  onSubmit,
  categories,
}: WeaponFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WeaponFormData>({
    resolver: zodResolver(weaponFormSchema),
    defaultValues: initialData,
  });

  const {
    fields: damageFields,
    append: appendDamage,
    remove: removeDamage,
  } = useFieldArray({ control, name: "damages" });

  const {
    fields: loadoutFields,
    append: appendLoadout,
    remove: removeLoadout,
  } = useFieldArray({ control, name: "loadouts" });

  const onFormSubmit = async (data: WeaponFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">Weapon Name</label>
        <input
          {...register("name")}
          type="text"
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium">Category</label>
        <select
          {...register("categoryId", { valueAsNumber: true })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 font-medium">Fire Rate (RPM)</label>
          <input
            {...register("fireRate", { valueAsNumber: true })}
            type="number"
            className="w-full p-2 border rounded"
          />
          {errors.fireRate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fireRate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Magazine</label>
          <input
            {...register("magazine", { valueAsNumber: true })}
            type="number"
            className="w-full p-2 border rounded"
          />
          {errors.magazine && (
            <p className="mt-1 text-sm text-red-600">
              {errors.magazine.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Reload Time (s)</label>
          <input
            {...register("reloadTime", { valueAsNumber: true })}
            type="number"
            step="0.1"
            className="w-full p-2 border rounded"
          />
          {errors.reloadTime && (
            <p className="mt-1 text-sm text-red-600">
              {errors.reloadTime.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Damage by Distance</h2>
          <button
            type="button"
            onClick={() => appendDamage({ distance: 0, damage: 0 })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Distance
          </button>
        </div>

        {damageFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 mb-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Distance (m)
              </label>
              <input
                {...register(`damages.${index}.distance`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="Distance (m)"
                className="w-full p-2 border rounded"
              />
              {errors.damages?.[index]?.distance && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.damages[index]?.distance?.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Damage</label>
              <input
                {...register(`damages.${index}.damage`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="Damage"
                className="w-full p-2 border rounded"
              />
              {errors.damages?.[index]?.damage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.damages[index]?.damage?.message}
                </p>
              )}
            </div>
            {damageFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeDamage(index)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.damages && !Array.isArray(errors.damages) && (
          <p className="mt-1 text-sm text-red-600">{errors.damages.message}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Loadouts</h2>
          <button
            type="button"
            onClick={() => appendLoadout({ name: "", bulletVelocity: 0 })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Loadout
          </button>
        </div>

        {loadoutFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 mb-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Loadout Name
              </label>
              <input
                {...register(`loadouts.${index}.name`)}
                type="text"
                placeholder="Loadout Name"
                className="w-full p-2 border rounded"
              />
              {errors.loadouts?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.loadouts[index]?.name?.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Bullet Velocity (m/s)
              </label>
              <input
                {...register(`loadouts.${index}.bulletVelocity`, {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="Bullet Velocity"
                className="w-full p-2 border rounded"
              />
              {errors.loadouts?.[index]?.bulletVelocity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.loadouts[index]?.bulletVelocity?.message}
                </p>
              )}
            </div>
            {loadoutFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeLoadout(index)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {errors.loadouts && !Array.isArray(errors.loadouts) && (
          <p className="mt-1 text-sm text-red-600">{errors.loadouts.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

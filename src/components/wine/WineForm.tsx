"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WineFormSchema, type WineFormValues } from "@/lib/validations/wine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { LocalWine } from "@/lib/dexie/db";

const WINE_TYPES = [
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rosé", label: "Rosé" },
  { value: "sparkling", label: "Sparkling" },
  { value: "dessert", label: "Dessert" },
  { value: "fortified", label: "Fortified" },
] as const;

interface WineFormProps {
  defaultValues?: Partial<LocalWine>;
  onSubmit: (data: WineFormValues) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export function WineForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit,
}: WineFormProps) {
  const [showOptional, setShowOptional] = useState(() => {
    if (!defaultValues) return false;
    return !!(
      defaultValues.region ||
      defaultValues.country ||
      defaultValues.varietal ||
      defaultValues.appellation ||
      defaultValues.storageLocation ||
      defaultValues.purchasePrice ||
      defaultValues.purchaseDate ||
      defaultValues.purchaseSource ||
      defaultValues.drinkFrom ||
      defaultValues.drinkBy ||
      defaultValues.notes
    );
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WineFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(WineFormSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      producer: defaultValues?.producer ?? "",
      vintage: defaultValues?.vintage ?? null,
      type: defaultValues?.type ?? "red",
      varietal: defaultValues?.varietal ?? null,
      region: defaultValues?.region ?? null,
      appellation: defaultValues?.appellation ?? null,
      country: defaultValues?.country ?? null,
      quantity: defaultValues?.quantity ?? 1,
      format: defaultValues?.format ?? "750ml",
      storageLocation: defaultValues?.storageLocation ?? null,
      purchasePrice: defaultValues?.purchasePrice ?? null,
      purchaseDate: defaultValues?.purchaseDate ?? null,
      purchaseSource: defaultValues?.purchaseSource ?? null,
      drinkFrom: defaultValues?.drinkFrom ?? null,
      drinkBy: defaultValues?.drinkBy ?? null,
      notes: defaultValues?.notes ?? null,
    },
  });

  // Re-initialize form when defaultValues changes (defensive reset for async defaultValues)
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name ?? "",
        producer: defaultValues.producer ?? "",
        vintage: defaultValues.vintage ?? null,
        type: defaultValues.type ?? "red",
        varietal: defaultValues.varietal ?? null,
        region: defaultValues.region ?? null,
        appellation: defaultValues.appellation ?? null,
        country: defaultValues.country ?? null,
        quantity: defaultValues.quantity ?? 1,
        format: defaultValues.format ?? "750ml",
        storageLocation: defaultValues.storageLocation ?? null,
        purchasePrice: defaultValues.purchasePrice ?? null,
        purchaseDate: defaultValues.purchaseDate ?? null,
        purchaseSource: defaultValues.purchaseSource ?? null,
        drinkFrom: defaultValues.drinkFrom ?? null,
        drinkBy: defaultValues.drinkBy ?? null,
        notes: defaultValues.notes ?? null,
      });
    }
  }, [defaultValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (data: WineFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Required Fields */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">
                  Wine Name <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Château Margaux 2015"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="producer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80">
                  Producer <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Château Margaux"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Type <span className="text-red-400">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a0a0a] border-white/20">
                      {WINE_TYPES.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="text-white focus:bg-white/10"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vintage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Vintage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`${new Date().getFullYear()}`}
                      min={1800}
                      max={new Date().getFullYear() + 1}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value, 10) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={9999}
                      className="bg-white/5 border-white/20 text-white"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? "750ml"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="750ml" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a0a0a] border-white/20">
                      {["375ml", "750ml", "1.5L", "3L", "6L"].map((f) => (
                        <SelectItem
                          key={f}
                          value={f}
                          className="text-white focus:bg-white/10"
                        >
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Optional Fields Toggle */}
        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors w-full py-1"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showOptional ? "rotate-180" : ""}`}
          />
          {showOptional
            ? "Hide optional details"
            : "Add more details (optional)"}
        </button>

        {showOptional && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Region</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Bordeaux"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. France"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="varietal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Grape Variety</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Cabernet Sauvignon"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appellation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Appellation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Margaux AOC"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Storage Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Cellar Rack A, Row 2"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Purchase Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : null,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">
                      Purchase Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white/5 border-white/20 text-white"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purchaseSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">
                    Purchase Source
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Total Wine, Winery direct"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="drinkFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Drink From</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white/5 border-white/20 text-white"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drinkBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Drink By</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-white/5 border-white/20 text-white"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="General notes about this wine…"
                      rows={3}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 resize-none"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-white/20 text-white/70 hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#8B1A1A] hover:bg-[#A52020] text-white"
          >
            {isSubmitting
              ? "Saving…"
              : isEdit
                ? "Save Changes"
                : "Add to Cellar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

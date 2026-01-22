// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { motion } from "framer-motion";
// import { X, Star, Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Category, ProgressStatus } from "@/types/tracking.types";
// import { useAuth } from "@/hooks/AuthContext";
// import { useTracking } from "@/hooks/useTracking";

// const trackingSchema = z.object({
//   status: z.nativeEnum(ProgressStatus),
//   progress: z.number().min(0).optional(),
//   rating: z.number().min(0).max(10).optional(),
// });

// type TrackingFormData = z.infer<typeof trackingSchema>;

// interface TrackingFormProps {
//   mediaId: string;
//   mediaTitle: string;
//   category: Category;
//   totalEpisodes?: number;
//   onClose: () => void;
// }

// export function TrackingForm({
//   mediaId,
//   mediaTitle,
//   category,
//   totalEpisodes,
//   onClose,
// }: TrackingFormProps) {
//   const { allEntries } = useTracking();
//   const existingEntry = allEntries.find((e) => e.id === mediaId);

//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<TrackingFormData>({
//     resolver: zodResolver(trackingSchema),
//     defaultValues: {
//       status: existingEntry?.status || ProgressStatus.PLANNING,
//       progress: existingEntry?.progress || 0,
//       rating: existingEntry?.rating || 0,
//     },
//   });

//   const status = watch("status");

//   const onSubmit = (data: TrackingFormData) => {
//     console.log("Form submitted:", { mediaId, ...data });
//     // Here you would typically call an API to save the tracking data
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(void 0);
//         onClose();
//       }, 1000);
//     });
//   };

//   const showProgress =
//     (category === Category.SERIES || category === Category.ANIME) &&
//     status === ProgressStatus.IN_PROGRESS &&
//     totalEpisodes;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         className="bg-card border rounded-xl shadow-2xl w-full max-w-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="p-6 border-b">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-xl font-bold">Track: {mediaTitle}</h2>
//                 <p className="text-sm text-muted-foreground">
//                   Update your progress
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={onClose}
//                 type="button"
//               >
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             <div>
//               <label className="text-sm font-medium">Status</label>
//               <Controller
//                 name="status"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <SelectTrigger className="mt-2">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.values(ProgressStatus).map((s) => (
//                         <SelectItem key={s} value={s}>
//                           {s}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 )}
//               />
//             </div>

//             {showProgress && (
//               <div>
//                 <label htmlFor="progress" className="text-sm font-medium">
//                   Progress ({watch("progress")} / {totalEpisodes})
//                 </label>
//                 <Controller
//                   name="progress"
//                   control={control}
//                   render={({ field }) => (
//                     <Slider
//                       id="progress"
//                       min={0}
//                       max={totalEpisodes}
//                       step={1}
//                       value={[field.value || 0]}
//                       onValueChange={(value) => field.onChange(value[0])}
//                       className="mt-3"
//                     />
//                   )}
//                 />
//               </div>
//             )}

//             <div>
//               <label className="text-sm font-medium">
//                 Rating ({watch("rating")?.toFixed(1) || "N/A"})
//               </label>
//               <Controller
//                 name="rating"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="flex items-center gap-2 mt-2">
//                     <Star className="w-5 h-5 text-muted-foreground" />
//                     <Slider
//                       min={0}
//                       max={10}
//                       step={0.5}
//                       value={[field.value || 0]}
//                       onValueChange={(value) => field.onChange(value[0])}
//                     />
//                   </div>
//                 )}
//               />
//             </div>
//           </div>

//           <div className="p-6 bg-secondary/50 border-t flex justify-end gap-3">
//             <Button variant="outline" onClick={onClose} type="button">
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               <Save className="w-4 h-4 mr-2" />
//               {isSubmitting ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </motion.div>
//   );
// }
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Star, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { useTracking } from "@/hooks/useTracking"; // ✅ IMPORTED HOOK
import { toast } from "sonner"; // Optional: For notifications

// 1. Schema Validation
const trackingSchema = z.object({
  status: z.nativeEnum(ProgressStatus),
  progress: z.number().min(0).optional(),
  rating: z.number().min(0).max(10).optional(),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

interface TrackingFormProps {
  mediaId: string;
  mediaTitle: string;
  category: Category;
  totalEpisodes?: number;
  posterUrl?: string; // ✅ Added this so the list looks good
  onClose: () => void;
}

export function TrackingForm({
  mediaId,
  mediaTitle,
  category,
  totalEpisodes,
  posterUrl,
  onClose,
}: TrackingFormProps) {
  // 2. Connect to the Hook
  const { allEntries, addOrUpdateEntry, deleteEntry, isUpdating } =
    useTracking();

  // Check if we are Editing or Adding
  const existingEntry = allEntries.find((e) => e.id === mediaId);
  const isEditing = !!existingEntry;

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      status: existingEntry?.status || ProgressStatus.PLANNING,
      progress: existingEntry?.progress || 0,
      rating: existingEntry?.rating || 0,
    },
  });

  const status = watch("status");

  // 3. The Real Submit Logic
  const onSubmit = async (data: TrackingFormData) => {
    try {
      await addOrUpdateEntry({
        id: mediaId,
        title: mediaTitle,
        category,
        posterUrl, // Save the poster so it appears in the list
        totalEpisodes,
        ...data, // status, progress, rating
      });

      toast.success(isEditing ? "Entry updated!" : "Added to list!");
      onClose();
    } catch (error) {
      toast.error("Failed to save entry. Please try again.");
    }
  };

  // 4. The Real Delete Logic
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this from your list?"))
      return;

    try {
      await deleteEntry(mediaId);
      toast.success("Entry removed from list");
      onClose();
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const showProgress =
    (category === Category.SERIES || category === Category.ANIME) &&
    status === ProgressStatus.IN_PROGRESS &&
    totalEpisodes;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {isEditing ? "Edit Entry" : "Add to List"}
              </h2>
              <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                {mediaTitle}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} type="button">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProgressStatus).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Progress Slider (Conditional) */}
            {showProgress && (
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Progress</label>
                  <span className="text-xs text-muted-foreground">
                    {watch("progress")} / {totalEpisodes} eps
                  </span>
                </div>
                <Controller
                  name="progress"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={0}
                      max={totalEpisodes}
                      step={1}
                      value={[field.value || 0]}
                      onValueChange={(val) => field.onChange(val[0])}
                    />
                  )}
                />
              </div>
            )}

            {/* Rating Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Your Rating</label>
                <span className="text-sm font-bold text-primary flex items-center gap-1">
                  {watch("rating") ? watch("rating") : "-"}{" "}
                  <Star className="w-3 h-3 fill-primary" />
                </span>
              </div>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value || 0]}
                    onValueChange={(val) => field.onChange(val[0])}
                  />
                )}
              />
              <div className="flex justify-between mt-1 px-1">
                <span className="text-[10px] text-muted-foreground">0</span>
                <span className="text-[10px] text-muted-foreground">10</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-secondary/20 border-t flex gap-3">
            {/* Delete Button (Only if editing) */}
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                title="Remove from list"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            <div className="flex-1 flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUpdating}>
                {isSubmitting || isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

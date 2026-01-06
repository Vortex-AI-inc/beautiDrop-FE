import { Service } from "@/types/service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Sparkles } from "lucide-react"

interface ServiceCardProps {
    service: Service
    onBook: (service: Service) => void
    index?: number
}

export function ServiceCard({ service, onBook, index = 0 }: ServiceCardProps) {
    return (
        <div
            className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Icon */}
                <div className="shrink-0">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.name}
                        </h3>
                        {service.category && (
                            <Badge variant="secondary" className="font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {service.category}
                            </Badge>
                        )}
                    </div>

                    <p className={`text-gray-500 text-sm mb-4 leading-relaxed ${!service.description ? 'italic' : ''}`}>
                        {service.description || `Professional ${service.name.toLowerCase()} service`}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 h-7 border-gray-200 text-gray-600 font-medium">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {service.duration_minutes} mins
                        </Badge>

                        {service.assigned_staff && service.assigned_staff.length > 0 && (
                            <div className="flex -space-x-2 overflow-hidden items-center">
                                {service.assigned_staff.slice(0, 3).map((staff) => (
                                    <div
                                        key={staff.staff_id}
                                        className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-[10px] font-bold text-gray-600 uppercase"
                                        title={staff.staff_name}
                                    >
                                        {staff.staff_name.charAt(0)}
                                    </div>
                                ))}
                                {service.assigned_staff.length > 3 && (
                                    <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-gray-50 items-center justify-center text-[9px] font-medium text-gray-500">
                                        +{service.assigned_staff.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end gap-3 shrink-0 md:min-w-[140px] pt-4 md:pt-0 border-t md:border-0 border-gray-100 w-full md:w-auto mt-4 md:mt-0">
                    <div className="text-right flex justify-between w-full md:block">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Starting at</p>
                        <p className="text-2xl font-bold text-gray-900">${parseFloat(service.price).toFixed(0)}</p>
                    </div>

                    <Button
                        onClick={() => onBook(service)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm h-10 px-6"
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

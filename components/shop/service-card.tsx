import { Service } from "@/types/service"
import { Button } from "@/components/ui/button"
import { Clock, Users, Sparkles, Star } from "lucide-react"

interface ServiceCardProps {
    service: Service
    onBook: (service: Service) => void
    index?: number
}

export function ServiceCard({ service, onBook, index = 0 }: ServiceCardProps) {
    return (
        <div
            className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-100 relative overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl -z-10"></div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Icon Column */}
                <div className="shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md shadow-blue-200">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-blue-600">
                            {service.name}
                        </h3>
                        {service.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                {service.category}
                            </span>
                        )}
                    </div>

                    <p className={`text-gray-500 mb-4 ${!service.description ? 'italic' : ''}`}>
                        {service.description || `Professional ${service.name.toLowerCase()} service`}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600 border border-gray-100">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{service.duration_minutes} minutes</span>
                        </div>

                        {service.assigned_staff && service.assigned_staff.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm text-gray-600 border border-gray-100">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span>{service.assigned_staff.length} {service.assigned_staff.length === 1 ? 'Specialist' : 'Specialists'}</span>
                            </div>
                        )}
                    </div>

                    {/* Staff Avatars */}
                    {service.assigned_staff && service.assigned_staff.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {service.assigned_staff.map((staff) => (
                                <div key={staff.staff_id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50/50 border border-purple-100">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white">
                                        {staff.staff_name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-purple-900">{staff.staff_name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price & Action Column */}
                <div className="flex flex-col items-end gap-4 md:min-w-[140px] shrink-0 self-center md:self-start w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-50 mt-2 md:mt-0">
                    <div className="text-right flex items-center justify-between w-full md:block">
                        <div className="text-xs text-gray-400 mb-0.5">Starting at</div>
                        <div className="text-4xl font-bold text-purple-600">
                            ${parseFloat(service.price).toFixed(0)}
                        </div>
                    </div>

                    <Button
                        onClick={() => onBook(service)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all rounded-xl h-11"
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    )
}

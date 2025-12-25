import { Injectable } from "@angular/core";
import { AdminEventList, EventsResponse, EventStatus } from "../models/admin-event.model";
import { EventApiItem, EventApiResponse } from "../models/admin-event-api.model";

@Injectable({
  providedIn: 'root',
})
export class AdminEventAdapter {
 static toEventsResponse(apiResponse: EventApiResponse): EventsResponse {
    return {
      events: apiResponse.items.map((item: EventApiItem) => this.toAdminEventList(item)),
      total: apiResponse.totalCount
    };
  }

  static toAdminEventList(item: EventApiItem): AdminEventList {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      eventType: {
        id: item.eventType.id,
        name: item.eventType.name
      },
      startDateTime: item.startDateTime,
      endDateTime: item.endDateTime,
      location: item.location,
      capacity: item.capacity,
      registeredCount: item.registeredCount,
      waitlistCount: item.waitlistCount,
      status: this.calculateStatus(item.startDateTime, item.endDateTime),
      imageUrl: item.imageUrl || null,
      tags: item.tags || [],
      createdBy: {
        id: 0,
        name: 'System',
        email: 'system@company.com',
        phone: ''
      },
      createdAt: new Date().toISOString(),
      agenda: [],
      speakers: [],
      faqs: []
    };
  }

  private static calculateStatus(start: string, end: string): EventStatus {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (now > endDate) return 'past';
    if (now < startDate) return 'upcoming';
    return 'upcoming';
  }
}
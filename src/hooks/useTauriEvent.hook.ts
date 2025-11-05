import { OffTauriEvent, OnTauriEvent } from "@api/index";
import { useCallback, useEffect, useRef } from "react";
import type { TauriTypes } from "$types";

/**
 * Custom hook for handling Tauri events with automatic cleanup
 * @param event - The Tauri event to listen to
 * @param handler - The callback function to handle the event
 */
export function useTauriEvent<T = any>(
	event: TauriTypes.Events,
	handler: (data: T) => void,
) {
	// Use a ref to always call the latest handler while keeping a stable callback reference
	const handlerRef = useRef(handler);

	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	const memoizedHandler = useCallback((data: T) => {
		// call the latest handler from the ref
		return handlerRef.current(data);
	}, []);

	useEffect(() => {
		OnTauriEvent<T>(event, memoizedHandler);

		return () => {
			OffTauriEvent<T>(event, memoizedHandler);
		};
	}, [event, memoizedHandler]);
}

/**
 * Hook for multiple Tauri events with automatic cleanup
 * @param events - Array of event configurations
 */
export function useTauriEvents(
	events: Array<{
		event: TauriTypes.Events;
		handler: (data: any) => void;
		deps?: React.DependencyList;
	}>,
) {
	useEffect(() => {
		const cleanupFunctions: Array<() => void> = [];

		events.forEach(({ event, handler }) => {
			OnTauriEvent(event, handler);
			cleanupFunctions.push(() => OffTauriEvent(event, handler));
		});

		return () => {
			cleanupFunctions.forEach((cleanup) => {
				cleanup();
			});
		};
	}, [events]); // depend on the events array itself
}

/**
 * Alternative approach: Hook that returns a cleanup function
 * Useful when you need conditional event registration
 */
export function useTauriEventWithCleanup<T = any>(
	event: TauriTypes.Events,
	handler: (data: T) => void,
): () => void {
	useEffect(() => {
		OnTauriEvent<T>(event, handler);

		return () => {
			OffTauriEvent<T>(event, handler);
		};
	}, [event, handler]);

	return useCallback(() => {
		OffTauriEvent<T>(event, handler);
	}, [event, handler]);
}

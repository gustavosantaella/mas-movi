import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';

/// Reusable modal bottom sheet styled with the Guayaba design system.
///
/// Usage:
/// ```dart
/// showAppBottomSheet(
///   context: context,
///   child: Column(children: [...]),
/// );
/// ```
///
/// Or with a builder for scrollable content:
/// ```dart
/// showAppBottomSheet(
///   context: context,
///   builder: (scrollController) => ListView(
///     controller: scrollController,
///     children: [...],
///   ),
/// );
/// ```
Future<T?> showAppBottomSheet<T>({
  required BuildContext context,
  Widget? child,
  Widget Function(ScrollController)? builder,
  double initialSize = 0.85,
  double minSize = 0.4,
  double maxSize = 0.95,
  bool isDismissible = true,
  bool showDragHandle = true,
  Color backgroundColor = AppColors.bgWhite,
}) {
  assert(child != null || builder != null, 'Provide either child or builder');

  return showModalBottomSheet<T>(
    context: context,
    isScrollControlled: true,
    isDismissible: isDismissible,
    backgroundColor: Colors.transparent,
    builder: (ctx) => _AppBottomSheetContent(
      child: child,
      builder: builder,
      initialSize: initialSize,
      minSize: minSize,
      maxSize: maxSize,
      showDragHandle: showDragHandle,
      backgroundColor: backgroundColor,
    ),
  );
}

class _AppBottomSheetContent extends StatelessWidget {
  final Widget? child;
  final Widget Function(ScrollController)? builder;
  final double initialSize;
  final double minSize;
  final double maxSize;
  final bool showDragHandle;
  final Color backgroundColor;

  const _AppBottomSheetContent({
    this.child,
    this.builder,
    required this.initialSize,
    required this.minSize,
    required this.maxSize,
    required this.showDragHandle,
    required this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: initialSize,
      minChildSize: minSize,
      maxChildSize: maxSize,
      builder: (context, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 20,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (showDragHandle) ...[
                const SizedBox(height: 12),
                Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFD1D5DB),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 8),
              ],
              Expanded(
                child: builder != null
                    ? builder!(scrollController)
                    : SingleChildScrollView(
                        controller: scrollController,
                        padding: const EdgeInsets.only(bottom: 40),
                        child: child!,
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}

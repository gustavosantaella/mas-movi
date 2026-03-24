import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';

/// Gradient button matching the RN GradientButton component
class GradientButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final bool disabled;
  final List<Color> colors;

  const GradientButton({
    super.key,
    required this.label,
    this.onPressed,
    this.loading = false,
    this.disabled = false,
    this.colors = const [AppColors.salmon, AppColors.coralIntense],
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = disabled || loading;
    return AnimatedOpacity(
      opacity: isDisabled ? 0.5 : 1.0,
      duration: const Duration(milliseconds: 200),
      child: Container(
        width: double.infinity,
        height: 56,
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: colors),
          borderRadius: BorderRadius.circular(14),
          boxShadow: isDisabled
              ? null
              : [
                  BoxShadow(
                    color: colors.first.withValues(alpha: 0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isDisabled ? null : onPressed,
            borderRadius: BorderRadius.circular(14),
            child: Center(
              child: loading
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: Colors.white,
                      ),
                    )
                  : Text(
                      label,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
            ),
          ),
        ),
      ),
    );
  }
}

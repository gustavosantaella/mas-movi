import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../helpers/date_formatter.dart';

/// Custom text input matching the RN AppInput component
class AppInput extends StatefulWidget {
  final String label;
  final String? placeholder;
  final IconData? icon;
  final String? type; // 'email', 'password', 'text', 'date'
  final String? value;
  final ValueChanged<String>? onChanged;
  final String? helpDescription;
  final bool showPasswordValidator;
  final TextEditingController? controller;

  const AppInput({
    super.key,
    required this.label,
    this.placeholder,
    this.icon,
    this.type = 'text',
    this.value,
    this.onChanged,
    this.helpDescription,
    this.showPasswordValidator = false,
    this.controller,
  });

  @override
  State<AppInput> createState() => _AppInputState();
}

class _AppInputState extends State<AppInput> {
  late TextEditingController _controller;
  bool _obscure = true;
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController(text: widget.value);
  }

  @override
  void dispose() {
    if (widget.controller == null) _controller.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    // Try to parse current value as initial date
    final current = DateFormatter.tryParse(_controller.text);
    final picked = await showDatePicker(
      context: context,
      initialDate: current ?? DateTime(2000),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(
            primary: AppColors.salmon,
            onPrimary: Colors.white,
            surface: AppColors.bgWhite,
            onSurface: AppColors.charcoal,
          ),
        ),
        child: child!,
      ),
    );
    if (picked == null) return;
    final formatted = DateFormatter.toDMY(picked);
    _controller.text = formatted;
    widget.onChanged?.call(DateFormatter.toISO(picked));
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final isPassword = widget.type == 'password';
    final isDate = widget.type == 'date';
    final value = _controller.text;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label
          Text(
            widget.label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: _focused ? AppColors.salmon : AppColors.grayNeutral,
            ),
          ),
          const SizedBox(height: 8),
          // Input
          Container(
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: _focused ? AppColors.salmon : AppColors.borderLightGray,
                width: _focused ? 1.5 : 1,
              ),
            ),
            child: TextField(
              controller: _controller,
              readOnly: isDate,
              obscureText: isPassword && _obscure,
              keyboardType: widget.type == 'email'
                  ? TextInputType.emailAddress
                  : TextInputType.text,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: AppColors.charcoal,
              ),
              decoration: InputDecoration(
                hintText: widget.placeholder ?? (isDate ? 'DD/MM/AAAA' : null),
                hintStyle: TextStyle(
                  color: AppColors.grayNeutral.withValues(alpha: 0.5),
                ),
                prefixIcon: widget.icon != null
                    ? Icon(widget.icon, color: AppColors.grayNeutral, size: 20)
                    : null,
                suffixIcon: isPassword
                    ? IconButton(
                        icon: Icon(
                          _obscure ? Icons.visibility_off : Icons.visibility,
                          color: AppColors.grayNeutral,
                          size: 20,
                        ),
                        onPressed: () => setState(() => _obscure = !_obscure),
                      )
                    : isDate
                        ? const Icon(Icons.calendar_today,
                            color: AppColors.grayNeutral, size: 18)
                        : null,
                border: InputBorder.none,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
              onChanged: widget.onChanged,
              onTap: isDate
                  ? _pickDate
                  : () => setState(() => _focused = true),
              onTapOutside: (_) => setState(() => _focused = false),
            ),
          ),
          // Help description
          if (widget.helpDescription != null) ...[
            const SizedBox(height: 6),
            Text(
              widget.helpDescription!,
              style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral),
            ),
          ],
          // Password validator
          if (isPassword && widget.showPasswordValidator && value.isNotEmpty) ...[
            const SizedBox(height: 10),
            _PasswordValidator(password: value),
          ],
        ],
      ),
    );
  }
}

class _PasswordValidator extends StatelessWidget {
  final String password;
  const _PasswordValidator({required this.password});

  @override
  Widget build(BuildContext context) {
    final has8 = password.length >= 8;
    final hasUpper = RegExp(r'[A-Z]').hasMatch(password);
    final hasSpecial = RegExp(r'[^A-Za-z0-9]').hasMatch(password);
    final total = (has8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasSpecial ? 1 : 0);

    Color barColor() {
      if (total <= 1) return Colors.red;
      if (total == 2) return Colors.orange;
      return AppColors.successGreen;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Strength bar
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: total / 3,
            backgroundColor: AppColors.borderLightGray,
            valueColor: AlwaysStoppedAnimation(barColor()),
            minHeight: 4,
          ),
        ),
        const SizedBox(height: 8),
        _Check(label: 'Mínimo 8 caracteres', ok: has8),
        _Check(label: 'Al menos 1 mayúscula', ok: hasUpper),
        _Check(label: 'Al menos 1 símbolo especial', ok: hasSpecial),
      ],
    );
  }
}

class _Check extends StatelessWidget {
  final String label;
  final bool ok;
  const _Check({required this.label, required this.ok});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Row(
        children: [
          Icon(
            ok ? Icons.check_circle : Icons.radio_button_unchecked,
            size: 14,
            color: ok ? AppColors.successGreen : AppColors.grayNeutral,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: ok ? AppColors.successGreen : AppColors.grayNeutral,
            ),
          ),
        ],
      ),
    );
  }
}
